window.onload = () => {
  document.querySelector('.btn-enviar').addEventListener('click', () => {
    const auth = new Auth();
    auth.signUp();
  });
}

class Auth{
  constructor(){
    this.username = null;
    this.picture = null;
  }

  signUp() {
    this.username = document.querySelector('#username').value;
    this.picture = document.querySelector('#picture').value;

    axios
      .post('http://localhost:5001/sign-up', {
        username: this.username,
        avatar: this.picture
      })
      .then(() => {
        const tweet = new Tweet();
        tweet.loadTweets();

        document.querySelector('.btn-enviar-tweet').addEventListener('click', () => {
          tweet.postTweet(this.username);
        })
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao fazer cadastro! Consulte os logs.');
      });
  }

}


class Tweet{
  constructor(){
    this.tweet = null;
  }

  loadTweets() {
    axios.get('http://localhost:5001/tweets').then(res => {
      const tweets = res.data;
      let tweetsHtml = '';
  
      for (const tweet of tweets) {
        tweetsHtml += `
          <div class="tweet">
            <div class="avatar">
              <img src="${tweet.avatar}" />
            </div>
            <div class="content">
              <div class="user">
                @${tweet.username}
              </div>
              <div class="body">
                ${this.escapeHtml(tweet.tweet)}
              </div>
            </div>
          </div>
        `;
      }
  
      document.querySelector('.tweets').innerHTML = tweetsHtml;
      document.querySelector('.pagina-inicial').classList.add('hidden');
      document.querySelector('.tweets-page').classList.remove('hidden');
    });
  }
  
  postTweet(username) {
    this.tweet = document.querySelector('#tweet').value;
  
    axios
      .post('http://localhost:5001/tweets', {
        username: username,
        tweet: this.tweet
      })
      .then(() => {
        document.querySelector('#tweet').value = '';
        this.loadTweets();
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao fazer tweet! Consulte os logs.');
      });
  }
  
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  

}

