from datetime import datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

BERLIN = ZoneInfo("Europe/Berlin")

def compute_delivery_end_at_utc(purchased_at_utc: datetime) -> datetime:
    """
    Normal: Lieferung bis zum kommenden Sonntag 07:00 (Europe/Berlin).
    Sonderregel: Kauf nach Samstag 23:59 -> Lieferung bis zum nächsten Sonntag 07:00.
    """
    if purchased_at_utc.tzinfo is None:
        purchased_at_utc = purchased_at_utc.replace(tzinfo=timezone.utc)

    local = purchased_at_utc.astimezone(BERLIN)

    # Ziel: der nächste Sonntag 07:00 (oder kommende Woche)
    days_until_sunday = (6 - local.weekday()) % 7  # Mon=0..Sun=6
    sunday_date = local.date() + timedelta(days=days_until_sunday)
    target_local = datetime.combine(sunday_date, time(7, 0), tzinfo=BERLIN)

    if local >= target_local:
        target_local += timedelta(days=7)

    # Sonderregel:
    # "nach Samstag 23:59" interpretieren wir als:
    # - Samstag 23:59:01+ oder
    # - Sonntag vor 07:00
    if (local.weekday() == 5 and local.time() > time(23, 59)) or (local.weekday() == 6 and local.time() < time(7, 0)):
        # sicherstellen: nächster Sonntag, nicht "dieser"
        # (wenn wir am Sonntag <07:00 sind, ist target_local bereits "heute 07:00" -> muss +7 Tage)
        if local.weekday() == 6 and target_local.date() == local.date():
            target_local += timedelta(days=7)

    return target_local.astimezone(timezone.utc)
