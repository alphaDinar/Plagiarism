const text_in = document.querySelector('textarea')
const loaders = document.querySelectorAll('.load_box div')

const handleResult = (top_result) => {
  if(window.innerWidth > 800){
    out_box.classList.add('change')
  }

  loaders.forEach(el => el.style.display = 'none')
  anime({
    targets : out_box.children[1],
    scale : [0,1],
  })

  if(top_result.score > 60){
    out_box.children[1].style.color = 'salmon'
  }else{
    out_box.children[1].style.color = 'rgb(25, 232, 128)'
  }

  out_box.children[1].innerHTML = `${top_result.score}%`
  out_box.children[2].href = top_result.link
  out_box.children[2].children[0].innerHTML = top_result.link
}

function checkPlagiarism() {
  const userInput = text_in.value;
  const apiKey = 'AIzaSyBeUnAcxTfqrXEDn4KrSYXx_P5h39ogop4';
  const searchEngineId = 'b7a672587e2884d44';
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${userInput}`;

  function loaderAnime() {
    loaders.forEach((el, i) => {
      anime({
        begin: () => {
          el.style.display = 'flex'
        },
        loop: true,
        targets: el,
        opacity: [0, 1],
        duration: 500,
        delay: i * 500,
        easing: 'easeInOutExpo'
      })
    })
  }
  loaderAnime()


  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const results = data.items;
      const plagiarismResults = [];
      let scoreList = []

      results.forEach(result => {
        const percentageMatch = calculateSimilarity(userInput, result.snippet);
        const plagiarismResult = {
          title: result.title,
          link: result.link,
        };
        plagiarismResults.push(plagiarismResult);
        scoreList.push(percentageMatch)
      });

      var highScore = Math.max(...scoreList.map(Number))
      var resIndex = scoreList.indexOf(highScore)
      plagiarismResults[resIndex]['score'] = highScore
      handleResult(plagiarismResults[resIndex])
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function calculateSimilarity(input, content) {
  const similarityScore = yourSimilarityAlgorithm(input, content);
  const percentageMatch = similarityScore * 100;

  let scoreList = []
  scoreList.push(percentageMatch)
  return parseInt(percentageMatch);
}

function yourSimilarityAlgorithm(input, content) {
  const inputWords = input.trim().toLowerCase().split(/\s+/);
  const contentWords = content.trim().toLowerCase().split(/\s+/);

  const commonWords = inputWords.filter(word => contentWords.includes(word));
  const similarityScore = commonWords.length / inputWords.length;
  return similarityScore;
}

window.onkeypress =(e)=>{
  if(e.key === 'Enter'){
    startCheck()
  }
}

const startCheck = () => {
  if (text_in.value.length > 0) {
    checkPlagiarism()
  }
  else {
    text_in.placeholder = 'Content is empty...'
    text_in.classList.add('danger')
  }
}
