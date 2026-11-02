import pandas as pd
if __name__ == '__main__':
    data = pd.DataFrame({'kota':['A','A','B'], 'omzet':[100,300,500], 'unit':[1,3,10]})
    ringkas = data.groupby('kota', as_index=False, sort=True).agg(omzet=('omzet','sum'), unit=('unit','sum'), baris=('omzet','size'))
    ringkas['rupiah_per_unit'] = ringkas['omzet'] / ringkas['unit']
    for row in ringkas.itertuples():
        print(row.kota, row.omzet, row.unit, row.rupiah_per_unit)
    print('Rasio keseluruhan:', round(data['omzet'].sum()/data['unit'].sum(), 2))
