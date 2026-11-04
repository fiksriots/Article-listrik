const {test,expect}=require('@playwright/test');
test('data API lokal terlihat pada halaman',async({request,page})=>{
 const invalid=await request.post('/api/observasi',{data:{layanan:'',hasil:'ok'}});
 expect(invalid.status()).toBe(400);
 const created=await request.post('/api/observasi',{data:{layanan:'BTS-LAB-API',hasil:'timeout'}});
 expect(created.status()).toBe(201);
 const row=await created.json();expect(row.layanan).toBe('BTS-LAB-API');
 await page.goto('/');await page.getByRole('button',{name:'Muat laporan'}).click();
 await expect(page.getByRole('listitem').filter({hasText:'BTS-LAB-API · timeout'})).toHaveCount(1);
});
test('respons gagal tidak ditampilkan sebagai sukses',async({page})=>{
 await page.route('**/api/observasi',route=>route.request().method()==='POST'
  ?route.fulfill({status:503,contentType:'application/json',body:'{"error":"latihan"}'})
  :route.continue());
 await page.goto('/');await page.getByLabel('Nama layanan').fill('BTS-LAB-Gagal');
 await page.getByRole('button',{name:'Simpan observasi'}).click();
 await expect(page.getByRole('status')).toContainText('Belum dapat menyimpan');
 await expect(page.getByLabel('Nama layanan')).toHaveValue('BTS-LAB-Gagal');
});
