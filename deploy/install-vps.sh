#!/usr/bin/env bash
# =====================================================================
#  Lia's Garten – Installation auf einem Linux-VPS (Debian / Ubuntu)
# =====================================================================
#
#  Richtet einen nginx-Webserver ein, der das Spiel ausliefert, damit es
#  von jedem Rechner oder Tablet im Browser gespielt werden kann.
#
#  Aufruf (als root bzw. mit sudo):
#
#    sudo bash install-vps.sh                        # Zugriff über http://<IP>/
#    sudo bash install-vps.sh --domain garten.example.de --email ich@example.de
#                                                    # mit HTTPS (Let's Encrypt)
#    sudo bash install-vps.sh --user lia --password geheim
#                                                    # zusätzlich mit Passwortschutz
#    sudo liasgarten-update                          # später: neueste Version holen
#
#  Optionen:
#    --domain NAME     Domain, die auf den VPS zeigt → HTTPS per Let's Encrypt
#    --email ADRESSE   E-Mail für Let's Encrypt (Ablauf-Warnungen), optional
#    --port PORT       HTTP-Port ohne Domain (Standard: 80)
#    --user NAME       Benutzername für Passwortschutz (mit --password)
#    --password PW     Passwort für Passwortschutz
#    --no-auth         vorhandenen Passwortschutz wieder entfernen
#    --repo URL        Git-Repository (Standard: GitHub-Repo von Lia's Garten)
#    --branch NAME     Git-Branch (Standard: der Haupt-Branch des Repos)
#    --update          nur Spieldateien aktualisieren (gespeicherte Einstellungen)
#    -h, --help        diese Hilfe
#
#  Das Skript darf beliebig oft ausgeführt werden; es überschreibt nur
#  seine eigene Konfiguration. Einstellungen werden in
#  /etc/liasgarten.conf gespeichert und bei späteren Läufen übernommen.
#
#  Das Repository ist privat. Zwei Wege:
#   a) Repo auf dem VPS klonen und das Skript von dort starten – dann
#      werden die Dateien aus diesem Klon genommen (empfohlen):
#        git clone https://<TOKEN>@github.com/apfelsafft/liasgarden.git
#        sudo bash liasgarden/deploy/install-vps.sh
#   b) Skript einzeln starten und klonen lassen:
#        --repo https://<TOKEN>@github.com/apfelsafft/liasgarden.git
# =====================================================================

set -euo pipefail

CONF_FILE=/etc/liasgarten.conf
APP_DIR=/opt/liasgarten
SRC_DIR=$APP_DIR/src
WEB_ROOT=/var/www/liasgarten
HTPASSWD_FILE=/etc/nginx/liasgarten.htpasswd
NGINX_SITE=/etc/nginx/sites-available/liasgarten
NGINX_LINK=/etc/nginx/sites-enabled/liasgarten
UPDATE_CMD=/usr/local/sbin/liasgarten-update

# Standardwerte (werden von /etc/liasgarten.conf und Optionen überschrieben)
REPO_URL="https://github.com/apfelsafft/liasgarden.git"
BRANCH="claude/lias-garden-game-design-tfrfzw"
DOMAIN=""
EMAIL=""
PORT="80"
SOURCE_MODE="git"        # git = eigener Klon unter /opt, local = Repo neben dem Skript
LOCAL_SRC=""

info() { printf '\033[1;32m▸ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$*" >&2; }
die()  { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

usage() { awk 'NR>4 && /^#  Das Skript/ {exit} NR>4 {sub(/^# ?/, ""); print}' "$0"; }

# ---------------------------------------------------------------------
#  Voraussetzungen & Optionen
# ---------------------------------------------------------------------
[[ $EUID -eq 0 ]] || die "Bitte als root ausführen: sudo bash $0"
command -v apt-get >/dev/null || die "Dieses Skript unterstützt Debian/Ubuntu (apt-get nicht gefunden)."

# gespeicherte Einstellungen früherer Läufe laden
# shellcheck source=/dev/null
[[ -f $CONF_FILE ]] && . "$CONF_FILE"

UPDATE_ONLY=0
AUTH_USER=""
AUTH_PASS=""
REMOVE_AUTH=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)   DOMAIN="${2:?--domain braucht einen Wert}"; shift 2 ;;
    --email)    EMAIL="${2:?--email braucht einen Wert}"; shift 2 ;;
    --port)     PORT="${2:?--port braucht einen Wert}"; shift 2 ;;
    --user)     AUTH_USER="${2:?--user braucht einen Wert}"; shift 2 ;;
    --password) AUTH_PASS="${2:?--password braucht einen Wert}"; shift 2 ;;
    --no-auth)  REMOVE_AUTH=1; shift ;;
    --repo)     REPO_URL="${2:?--repo braucht einen Wert}"; SOURCE_MODE="git"; shift 2 ;;
    --branch)   BRANCH="${2:?--branch braucht einen Wert}"; shift 2 ;;
    --update)   UPDATE_ONLY=1; shift ;;
    -h|--help)  usage; exit 0 ;;
    *)          die "Unbekannte Option: $1 (Hilfe: --help)" ;;
  esac
done

if ! [[ $PORT =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then die "Ungültiger Port: $PORT"; fi
if [[ -n $AUTH_USER || -n $AUTH_PASS ]] && [[ -z $AUTH_USER || -z $AUTH_PASS ]]; then
  die "Für den Passwortschutz bitte --user UND --password angeben."
fi

# Liegt das Skript in einem geklonten Repo, werden die Dateien von dort genommen.
SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
# Die installierte Kopie unter /opt übernimmt die gespeicherte Quelle; ein
# einzeln heruntergeladenes Skript klont das Repo.
if [[ $UPDATE_ONLY -eq 0 ]]; then
  if [[ -f $SCRIPT_DIR/../index.html && -f $SCRIPT_DIR/../game.js ]]; then
    SOURCE_MODE="local"
    LOCAL_SRC="$(cd "$SCRIPT_DIR/.." && pwd)"
  elif [[ $SCRIPT_DIR != "$APP_DIR" ]]; then
    SOURCE_MODE="git"
    LOCAL_SRC=""
  fi
fi

# ---------------------------------------------------------------------
#  Spieldateien holen und veröffentlichen
# ---------------------------------------------------------------------
fetch_sources() {
  if [[ $SOURCE_MODE == "local" ]]; then
    SRC="$LOCAL_SRC"
    # git als Besitzer des Repos ausführen (als root lehnt git fremde Repos ab)
    local owner; owner="$(stat -c %U "$SRC")"
    if [[ -d $SRC/.git ]] && runuser -u "$owner" -- git -C "$SRC" rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
      info "Aktualisiere Repo in $SRC (git pull) …"
      runuser -u "$owner" -- git -C "$SRC" pull -q --ff-only || warn "git pull fehlgeschlagen – verwende vorhandenen Stand."
    fi
  else
    SRC="$SRC_DIR"
    mkdir -p "$APP_DIR"
    if [[ -d $SRC/.git ]]; then
      info "Hole neueste Version ($BRANCH) …"
      git -C "$SRC" remote set-url origin "$REPO_URL"
      git -C "$SRC" fetch --depth 1 origin "$BRANCH"
      git -C "$SRC" checkout -q -B "$BRANCH" FETCH_HEAD
    else
      info "Lade Lia's Garten herunter ($BRANCH) …"
      rm -rf "$SRC"
      git clone -q --depth 1 --branch "$BRANCH" "$REPO_URL" "$SRC" \
        || die "Klonen fehlgeschlagen. Ist das Repo privat? Dann --repo https://<TOKEN>@github.com/… verwenden oder das Skript aus einem geklonten Repo starten."
    fi
  fi
  [[ -f $SRC/index.html ]] || die "In $SRC wurde keine index.html gefunden."
}

publish() {
  info "Veröffentliche Spieldateien nach $WEB_ROOT …"
  mkdir -p "$WEB_ROOT"
  # Nur das Spiel ausliefern – kein .git, keine Doku, keine Skripte.
  rsync -a --delete \
    --exclude '.git*' --exclude '*.md' --exclude 'deploy/' \
    --exclude 'package.json' --exclude 'package-lock.json' --exclude 'node_modules/' \
    "$SRC"/ "$WEB_ROOT"/
  chown -R root:root "$WEB_ROOT"
  find "$WEB_ROOT" -type d -exec chmod 755 {} +
  find "$WEB_ROOT" -type f -exec chmod 644 {} +
}

if [[ $UPDATE_ONLY -eq 1 ]]; then
  [[ -f $CONF_FILE ]] || die "Noch nicht installiert – bitte zuerst ohne --update ausführen."
  fetch_sources
  publish
  info "Aktualisierung fertig. Im Browser ggf. neu laden."
  exit 0
fi

# ---------------------------------------------------------------------
#  Pakete
# ---------------------------------------------------------------------
info "Installiere Pakete (nginx, git, rsync …) …"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
PKGS=(nginx git rsync ca-certificates curl)
[[ -n $AUTH_USER ]] && PKGS+=(apache2-utils)
[[ -n $DOMAIN ]] && PKGS+=(certbot python3-certbot-nginx)
apt-get install -y -qq "${PKGS[@]}" >/dev/null

fetch_sources
publish

# ---------------------------------------------------------------------
#  Passwortschutz (optional)
# ---------------------------------------------------------------------
if [[ $REMOVE_AUTH -eq 1 ]]; then
  rm -f "$HTPASSWD_FILE"
  info "Passwortschutz entfernt."
elif [[ -n $AUTH_USER ]]; then
  htpasswd -bcB "$HTPASSWD_FILE" "$AUTH_USER" "$AUTH_PASS" >/dev/null 2>&1
  chown root:www-data "$HTPASSWD_FILE"
  chmod 640 "$HTPASSWD_FILE"
  info "Passwortschutz für Benutzer '$AUTH_USER' eingerichtet."
fi

AUTH_BLOCK=""
if [[ -f $HTPASSWD_FILE ]]; then
  AUTH_BLOCK="    auth_basic \"Lia's Garten\";
    auth_basic_user_file $HTPASSWD_FILE;"
fi

# ---------------------------------------------------------------------
#  nginx
# ---------------------------------------------------------------------
if [[ -n $DOMAIN ]]; then
  LISTEN_ARGS=(80)
  SERVER_NAME="$DOMAIN"
else
  # Ohne Domain: Standard-Server, erreichbar über die IP-Adresse.
  LISTEN_ARGS=("$PORT default_server")
  SERVER_NAME="_"
  rm -f /etc/nginx/sites-enabled/default
fi

LISTEN="listen ${LISTEN_ARGS[0]};"
# IPv6 nur, wenn der Server es unterstützt (sonst startet nginx nicht)
if [[ -f /proc/net/if_inet6 ]]; then
  LISTEN+="
    listen [::]:${LISTEN_ARGS[0]};"
fi

# Bei vorhandenem Zertifikat trägt certbot seine HTTPS-Blöcke unten erneut ein.
info "Schreibe nginx-Konfiguration …"
cat > "$NGINX_SITE" <<EOF
# Lia's Garten – erzeugt von install-vps.sh (wird bei erneutem Lauf überschrieben)
server {
    $LISTEN
    server_name $SERVER_NAME;

    root $WEB_ROOT;
    index index.html;
    charset utf-8;

$AUTH_BLOCK

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    location / {
        try_files \$uri \$uri/ =404;
        # Dateinamen enthalten keine Versionsnummer → immer auf neue Version prüfen
        add_header Cache-Control "no-cache" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
    }

    location ~ /\. { deny all; }
}
EOF
ln -sf "$NGINX_SITE" "$NGINX_LINK"

nginx -t -q || die "nginx-Konfiguration fehlerhaft (siehe oben)."
systemctl enable nginx >/dev/null 2>&1 || true
systemctl reload nginx 2>/dev/null || systemctl restart nginx 2>/dev/null || nginx -s reload 2>/dev/null || nginx

# ---------------------------------------------------------------------
#  HTTPS per Let's Encrypt (nur mit Domain)
# ---------------------------------------------------------------------
if [[ -n $DOMAIN ]]; then
  info "Hole HTTPS-Zertifikat für $DOMAIN …"
  CERT_ARGS=(--nginx -d "$DOMAIN" --non-interactive --agree-tos --redirect --keep-until-expiring)
  if [[ -n $EMAIL ]]; then CERT_ARGS+=(-m "$EMAIL"); else CERT_ARGS+=(--register-unsafely-without-email); fi
  if certbot "${CERT_ARGS[@]}"; then
    info "HTTPS aktiv. Zertifikate werden automatisch erneuert."
  else
    warn "Zertifikat konnte nicht geholt werden. Zeigt der DNS-Eintrag von $DOMAIN auf diesen Server und ist Port 80 offen?"
    warn "Das Spiel ist vorerst per http://$DOMAIN/ erreichbar. Später einfach das Skript erneut ausführen."
  fi
fi

# ---------------------------------------------------------------------
#  Firewall (nur wenn ufw bereits aktiv ist – sonst nichts verändern)
# ---------------------------------------------------------------------
if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q "Status: active"; then
  info "Öffne Ports in der Firewall (ufw) …"
  if [[ -n $DOMAIN ]]; then
    ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null
  else
    ufw allow "$PORT"/tcp >/dev/null
  fi
fi

# ---------------------------------------------------------------------
#  Einstellungen merken & Update-Befehl einrichten
# ---------------------------------------------------------------------
cat > "$CONF_FILE" <<EOF
# Lia's Garten – Einstellungen von install-vps.sh
REPO_URL=$(printf '%q' "$REPO_URL")
BRANCH=$(printf '%q' "$BRANCH")
DOMAIN=$(printf '%q' "$DOMAIN")
EMAIL=$(printf '%q' "$EMAIL")
PORT=$(printf '%q' "$PORT")
SOURCE_MODE=$(printf '%q' "$SOURCE_MODE")
LOCAL_SRC=$(printf '%q' "$LOCAL_SRC")
EOF
chmod 600 "$CONF_FILE"   # kann einen Token in REPO_URL enthalten

mkdir -p "$APP_DIR"
install -m 755 "$(readlink -f "$0")" "$APP_DIR/install-vps.sh"
cat > "$UPDATE_CMD" <<EOF
#!/usr/bin/env bash
exec bash $APP_DIR/install-vps.sh --update "\$@"
EOF
chmod 755 "$UPDATE_CMD"

# ---------------------------------------------------------------------
#  Fertig
# ---------------------------------------------------------------------
if [[ -n $DOMAIN ]]; then
  if [[ -d /etc/letsencrypt/live/$DOMAIN ]]; then URL="https://$DOMAIN/"; else URL="http://$DOMAIN/"; fi
else
  IP="$(curl -fs4 --max-time 5 https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')"
  if [[ $PORT == 80 ]]; then URL="http://$IP/"; else URL="http://$IP:$PORT/"; fi
fi

echo
info "Lia's Garten ist installiert! 🌻"
echo "   Im Browser (Rechner oder Tablet) öffnen:  $URL"
echo "   Neueste Version einspielen:               sudo liasgarten-update"
[[ -f $HTPASSWD_FILE ]] && echo "   Passwortschutz:                          aktiv"
echo
echo "   Hinweis: Hat dein VPS-Anbieter eine eigene Firewall (Cloud-Panel),"
echo "   dort Port ${DOMAIN:+80 und 443}${DOMAIN:-$PORT} (TCP) freigeben."
