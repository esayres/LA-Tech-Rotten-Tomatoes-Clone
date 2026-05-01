import axios from 'axios';

async function getMovies() {
    const data = await axios.get('https://api-zax4miz7qq-uc.a.run.app/getMovies')
        .then(res => {
            console.log(res.data);
            if (res.data && Array.isArray(res.data.data)) {
                return res.data.data;
            }
        })
        .catch(err => console.log(err));
    
        return data;
}

export default { getMovies };