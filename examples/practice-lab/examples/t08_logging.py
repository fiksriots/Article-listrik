import io,json,logging
stream=io.StringIO()
logger=logging.getLogger('praktik-lab')
logger.handlers.clear();logger.propagate=False;logger.setLevel(logging.INFO)
handler=logging.StreamHandler(stream)
handler.setFormatter(logging.Formatter('%(message)s'));logger.addHandler(handler)
logger.info(json.dumps({'job':'laporan-lab','tahap':'validasi','diterima':4,'ditolak':1}))
print(stream.getvalue().strip())
