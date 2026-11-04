import io
import json
import logging

def klasifikasi(exc):
    if isinstance(exc, TimeoutError):
        return 'timeout'
    if isinstance(exc, ConnectionRefusedError):
        return 'refused'
    if isinstance(exc, EOFError):
        return 'eof'
    return 'error_lain'

if __name__ == '__main__':
    stream = io.StringIO()
    logger = logging.getLogger('lab-jaringan')
    logger.handlers.clear()
    logger.propagate = False
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler(stream)
    handler.setFormatter(logging.Formatter('%(message)s'))
    logger.addHandler(handler)
    for percobaan, exc in enumerate([TimeoutError(), ConnectionRefusedError(), EOFError()], 1):
        logger.info(json.dumps({'layanan': 'lab-A', 'percobaan': percobaan, 'hasil': klasifikasi(exc)}))
    print(stream.getvalue().strip())
