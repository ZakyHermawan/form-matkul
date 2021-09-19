const api_url = "/getAll"
    
const show =  (data) => {
    console.log(data);
    let tab = `
        <tr>
            <th>Kode Matkul</th>
            <th>Nama Matkul</th>
            <th>Nama Dosen</th>
        </tr>
    `;
    
    for(let r of data) {
        tab += `
            <tr>
                <td>${r.kode_matkul}</td>
                <td>${r.nama_matkul}</td>
                <td>${r.nama_dosen}</td>
            </tr>
        `;
    }

    document.getElementById('matkul').innerHTML = tab;
}

const getAPI = async (url) => {
  const response = await fetch(url);
  var data = await response.json();
  show(data);
}

getAPI(api_url);
