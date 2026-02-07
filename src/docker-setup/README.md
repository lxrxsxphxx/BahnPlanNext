Dokumentation zum Docker-Setup:

Vorberteitung:
- man benötigt Docker-Desktop auf seinem PC. Dieses Tool kann man sich hier herunterladen: 
  - Windows: https://docs.docker.com/desktop/setup/install/windows-install/
  - Linux: https://docs.docker.com/desktop/setup/install/linux/
- Bei erstmaliger Installation wird gefordert, dass man entweder Business Acc oder Privaten Acc zu generieren, dies kann man umgehen und die "Private" Version nutzen.

Benutzung:
- Im Repository muss man in den Unterordner src/Backend/docker-setup wechseln
- Bei initialem ausführen/starten: `docker compose up --build`
- Ausführen, wenn kein Code verändert wurde: `docker compose up`
- baut alles neu, ohne Cache zu nutzen: `docker compose build --no-cache`
- nur einen service neu bauen: `docker compose up --build <service>`
  - Es gibt folgende services: db, backend, frontend
 
Bei Fragen: @Benni anschreiben :)
