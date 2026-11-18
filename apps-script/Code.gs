// Tambahkan bagian ini pada Code.gs yang sudah berjalan di Apps Script.
// Deploy ulang sebagai Web App setelah perubahan disimpan.
function createApiToken() {
  const token = Utilities.getUuid() + Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty('SUMUR_API_TOKEN', token);
  console.log('Simpan token ini di environment variable SUMUR_API_TOKEN pada Vercel: ' + token);
}
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty('SUMUR_API_TOKEN');
    if (!expected || body.token !== expected) throw new Error('Token API tidak valid.');
    const action = String(body.action || '');
    const args = body.args;
    const allowed = {getState:0,saveProgress:2,saveLocation:3,deleteProgress:2};
    if (!Object.prototype.hasOwnProperty.call(allowed, action) || !Array.isArray(args) || args.length !== allowed[action]) throw new Error('Permintaan tidak valid.');
    const result = ({getState:getState,saveProgress:saveProgress,saveLocation:saveLocation,deleteProgress:deleteProgress})[action].apply(null,args);
    return ContentService.createTextOutput(JSON.stringify({ok:true,result:result})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err.message || err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
