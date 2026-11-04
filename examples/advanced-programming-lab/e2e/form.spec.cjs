const {test,expect}=require('@playwright/test');
test('validasi, simpan, dan navigasi laporan',async({page})=>{
 await page.goto('/');
 await page.getByLabel('Nama layanan').fill('   ');
 await page.getByRole('button',{name:'Simpan observasi'}).click();
 await expect(page.getByRole('status')).toContainText('Nama layanan wajib');
 await page.getByLabel('Nama layanan').fill('BTS-LAB-Form');
 await page.getByLabel('Hasil',{exact:true}).selectOption('ok');
 await page.getByRole('button',{name:'Simpan observasi'}).click();
 await expect(page.getByRole('status')).toHaveText('Data tersimpan.');
 await page.getByRole('link',{name:'Daftar laporan',exact:true}).click();
 await expect(page).toHaveURL(/#daftar$/);
 await expect(page.getByRole('listitem').filter({hasText:'BTS-LAB-Form · ok'})).toHaveCount(1);
});
