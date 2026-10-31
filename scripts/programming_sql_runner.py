"""Run complete educational SQL statements on a fresh in-memory SQLite connection."""
import sqlite3

def statements(code):
    pending = ''
    for char in code:
        pending += char
        if char == ';' and sqlite3.complete_statement(pending):
            yield pending
            pending = ''
    if pending.strip():
        raise ValueError('Expected a complete SQL statement ending with semicolon')

def run_sql(code):
    con = sqlite3.connect(':memory:', isolation_level=None)
    try:
        lines = []
        for statement in statements(code):
            cursor = con.execute(statement)
            if cursor.description:
                for row in cursor.fetchall():
                    lines.append(' | '.join('NULL' if value is None else str(value) for value in row))
        return '\n'.join(lines)
    finally:
        con.close()
