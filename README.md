# Web Audio Arpeggio player

The hype got me finally convinced building something with ChatGPT. I asked it to create chiptune style music.

The music sequence `['C4', 'E4', 'G4', 'C5', 'E4', 'A4', 'D5', 'G5']` is composed by ChatGPT 3.5.
It didn't get the FM Synthesis right so that was done by me :D

Which still confirms my assumption ChatGPT is not here to help us but we're there to help ChatGPT ^^ :D.

Oh and it has a bad memory leak which causes the JavaScript to crash after a while, I guess due to the white noise buffer, filling memory with `Math.random()`.
