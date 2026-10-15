import os

import mysql.connector


def get_connection():
    required = {
        "host": os.getenv("MYSQL_HOST"),
        "user": os.getenv("MYSQL_USER"),
        "password": os.getenv("MYSQL_PASSWORD"),
        "database": os.getenv("MYSQL_DATABASE"),
    }
    missing = [name for name, value in required.items() if not value]
    if missing:
        raise RuntimeError(
            "Set the following MySQL environment variables: "
            + ", ".join(f"MYSQL_{name.upper()}" for name in missing)
        )

    return mysql.connector.connect(
        **required,
        port=int(os.getenv("MYSQL_PORT", "3306")),
    )
