import hashlib
import json
from pathlib import Path
import joblib
import numpy as np
from sklearn import __version__ as sklearn_version
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error

def bangun(folder):
    folder=Path(folder);folder.mkdir(parents=True,exist_ok=True)
    rng=np.random.default_rng(42)
    features=rng.normal(size=(80,2));target=5*features[:,0]-2*features[:,1]+rng.normal(scale=.2,size=80)
    train,validation,test=slice(0,48),slice(48,64),slice(64,80)
    experiments=[]
    for alpha in [.1,1.,10.]:
        model=make_pipeline(StandardScaler(),Ridge(alpha=alpha)).fit(features[train],target[train])
        experiments.append({'alpha':alpha,'mae_validation':float(mean_absolute_error(target[validation],model.predict(features[validation])))})
    best=min(experiments,key=lambda row:row['mae_validation'])['alpha']
    final=make_pipeline(StandardScaler(),Ridge(alpha=best)).fit(features[:64],target[:64])
    expected=final.predict(features[test])
    path=folder/'model-lab.joblib'
    # Hanya file model yang baru dibuat oleh program sendiri ini yang dimuat.
    joblib.dump(final,path)
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    manifest={'seed':42,'fit_rows':64,'test_rows':16,'features':['fitur_a','fitur_b'],
              'sklearn':sklearn_version,'sha256':digest,'experiments':experiments,'selected_alpha':best}
    (folder/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    if hashlib.sha256(path.read_bytes()).hexdigest()!=manifest['sha256']:raise ValueError('Artefak berubah.')
    loaded=joblib.load(path)
    same=bool(np.allclose(expected,loaded.predict(features[test])))
    return manifest,same,float(mean_absolute_error(target[test],expected))

if __name__=='__main__':
    manifest,same,mae=bangun('hasil-latihan')
    print('Eksperimen:',len(manifest['experiments']))
    print('Alpha dipilih dari validation:',manifest['selected_alpha'])
    print('Prediksi sesudah muat sama:',same)
    print('MAE test akhir:',round(mae,4))
    print('Model lokal buatan sendiri; hash bukan bukti kepercayaan sumber')
