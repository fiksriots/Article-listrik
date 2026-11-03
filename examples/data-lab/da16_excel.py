from io import BytesIO
import pandas as pd
def contoh_workbook():
    buffer=BytesIO()
    data=pd.DataFrame({'id':['001','002'],'jumlah':[1,2]})
    with pd.ExcelWriter(buffer,engine='openpyxl') as writer:
        data.to_excel(writer,sheet_name='Transaksi',index=False)
        pd.DataFrame({'catatan':['Data fiktif; ID adalah teks.']}).to_excel(writer,sheet_name='Metadata',index=False)
    buffer.seek(0)
    with pd.ExcelFile(buffer,engine='openpyxl') as book:
        sheets=book.sheet_names
        hasil=pd.read_excel(book,sheet_name='Transaksi',dtype={'id':'string'})
    return sheets,hasil
if __name__=='__main__':
    sheets,data=contoh_workbook()
    print('Sheet:',sheets)
    print('ID:',data['id'].tolist())
    print('Total jumlah:',int(data['jumlah'].sum()))
