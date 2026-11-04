const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({testDir:'./e2e',workers:1,retries:0,forbidOnly:true,
 use:{baseURL:'http://127.0.0.1:8020',headless:true},
 webServer:{command:'python lab_web.py --port 8020',url:'http://127.0.0.1:8020',reuseExistingServer:false,timeout:10000}});
