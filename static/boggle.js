class BoggleGame {
    //create boggle game with board Id
  
    constructor(boardId, secs = 60) {
        this.secs = secs;
        this.showTimer();
  
        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId);
  
        this.timer = setInterval(this.tick.bind(this), 1000);
  
        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
        $(".new-game", this.board).on("click", this.handleNewGame.bind(this));
    }
  
    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
    }
  
    showScore() {
        $(".score", this.board).text(this.score);
    }   
  
    showMessage(msg) {
        $(".msg", this.board).text(msg);
    }
    
    async handleSubmit(evt) {
    //handle submit word, check to make sure it hasn't been used and is in dictionary

        evt.preventDefault();
        const $word = $(".word", this.board);
  
        let word = $word.val();
        if (!word) return;
  
        if (this.words.has(word)) {
            this.showMessage(`Already found ${word}`);
            $word.val("").focus();
            return;
        }
  
      // check to make sure word is valid
        const resp = await axios.get("/check-word", { params: { word: word }});
        if (resp.data.result === "not-word") {
            this.showMessage(`"${word}" is not a valid word in the dictionary`);
        } else if (resp.data.result === "not-on-board") {
            this.showMessage(`"${word}" is not a valid word on the board`);
        } else {
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showWord(word);
            this.showMessage(`Added: ${word}`);
        }
  
        $word.val("").focus();
    }

    handleNewGame(evt) {
        evt.preventDefault();
        location.reload();
    }
      
  
    showTimer() {
        $(".timer", this.board).text(this.secs);
    }
    
    //tracks seconds ticking and when timer hits 0
    async tick() {
        this.secs -= 1;
        this.showTimer();
  
        if (this.secs === 0) {
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }
  
  
    async scoreGame() {
        $(".add-word", this.board).hide();
        $(".new-game", this.board).show();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokeRecord) {
            this.showMessage(`New record: ${this.score}`);
        } else {
            this.showMessage(`Final score: ${this.score}`);
        }
    }
}

  