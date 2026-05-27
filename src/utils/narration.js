// src/utils/narration.js
import { say, ask, cheer, emphasize, think, encourage, instruct } from './audio.js';

export function introNarration() {
  return [
    cheer("Welcome, adventurer! Numby needs your help!"),
    say("Deep inside the Number Cave, there are mysterious crystals with numbers beyond one hundred."),
    ask("Can you help Numby read them?"),
  ];
}

export function wonderNarration() {
  return [
    ask("Have you ever wondered what number comes after one hundred?"),
    encourage("Let's find out together!"),
  ];
}

export function learnSection3ANarration() {
  return [
    say("After ninety-nine comes one hundred."),
    say("After one hundred comes one hundred and one."),
    say("After one hundred and one comes one hundred and two."),
    instruct("Keep counting with Numby!"),
  ];
}

export function learnSection3BNarration() {
  return [
    instruct("Let's look at the place value chart."),
    say("Every number has three places: hundreds, tens, and ones."),
    emphasize("This number has one hundred, three tens, and four ones."),
    emphasize("So we write: one hundred and thirty-four."),
  ];
}

export function learnSection3CNarration() {
  return [
    instruct("Let's practice counting tens and ones."),
    say("Count with me! Ten, twenty, thirty, forty, fifty..."),
    emphasize("We count the hundreds block first, then add the tens and ones!"),
  ];
}

export function learnSection3DNarration() {
  return [
    instruct("Now let's practice matching word names to numbers."),
    say("Remember, we write words exactly as we say them: one hundred and fifty-six."),
    cheer("You are getting very good at this!"),
  ];
}

export function correctAnswerNarration() {
  const options = [
    cheer("Amazing! You got it right!"),
    cheer("Brilliant! Numby is so proud of you!"),
    cheer("Fantastic! Keep going!"),
  ];
  return [options[Math.floor(Math.random() * options.length)]];
}

export function wrongAnswerNarration() {
  return [encourage("Not quite! Let's try again. You can do it!")];
}

export function reflectNarration() {
  return [
    cheer("Incredible work! You are now a Number Explorer!"),
    cheer("You can read and write all numbers from one hundred to two hundred!"),
    say("Numby has collected all the crystals thanks to you!"),
  ];
}
