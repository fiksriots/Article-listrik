"""Catat peristiwa dan hitungan, bukan seluruh data masukan."""
from .core import ringkas

def ringkas_tercatat(rows, logger):
    try:
        summary = ringkas(rows)
    except ValueError:
        logger.warning('ringkasan_invalid', extra={'tahap': 'validasi'})
        raise
    logger.info('ringkasan_selesai', extra={'tahap': 'ringkasan', 'total': summary['total']})
    return summary
