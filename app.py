from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"

boggle_game = Boggle()


@app.route("/")
def home():
    """Display boggle board"""

    boardId = 'my-board-id'
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    num_plays = session.get("num_plays", 0)

    return render_template("boggle.html", board=board,highscore=highscore,
                            num_plays=num_plays,boardId=boardId)


@app.route("/check-word")
def check_word():
    """Check if word is valid"""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})


@app.route("/post-score", methods=["POST"])
def post_score():
    """Get score, update number of plays, update high score if needed"""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    num_plays = session.get("num_plays", 0)

    session['num_plays'] = num_plays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)