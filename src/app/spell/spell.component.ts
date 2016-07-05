import { Component, OnInit } from '@angular/core';
import { AppState } from '../app.service';
import { AuthService} from '../auth.service'
import { WordsService } from './wordsService.service';
import { LetterCheckingService } from './LetterCheckingService.service';


@Component({
  selector: 'spell',
  template: require('./spell.component.html'),
  styles: [require('./spell.component.css')],
  providers: [AppState, WordsService, LetterCheckingService]
})

export class Spell implements OnInit {
  leapCtrl;

  constructor(
    private appState: AppState,
    private authService: AuthService) {}

  private state = this.leapViewer._state;
  private spellingWord:string = '';
  private showWord:boolean = false;
  private showSkip:boolean = false;
  private skippedWords = [];
  private capturedLetter:string = '';
  private capturedLetterColor:string = '';
  private nextLetter:string = '';
  private nextLetterIndex:number = 0;
  private rightPanelWord:string = '';
  private wordPercent:number = 0;
  private correctWords = [];

  ngOnInit() {
    this.nextWord();
  }

  nextWord() {
    this.skippedWords.push(this.spellingWord);
    this.spellingWord = this.wordsService.returnRandomWord();
    this.nextLetter = this.spellingWord[this.nextLetterIndex].toLowerCase();
    console.log('next letter expected at first', this.nextLetter);
    let spell = this;
    setTimeout(() => {
      spell.showWord = true;
    }, 2000);
    setTimeout(() => {
      spell.showSkip = true;
    }, 3000);
    setInterval(() => {
      this.checkLetter();
    }, 3000);
  }

  skippedClick(event) {
    console.log(event.target.innerText);
  }

  checkLetter() {
    this.capturedLetter = this.letterCheckingService.getLetter();
    if (this.capturedLetter === this.nextLetter) {
      console.log('letter found', this.capturedLetter);
      this.capturedLetterColor = 'green';
      this.rightPanelWord += this.capturedLetter;
      this.wordPercent = (this.rightPanelWord.length / this.spellingWord.length) * 100;
      this.nextLetter = this.spellingWord[this.nextLetterIndex];
      if (this.nextLetterIndex < this.spellingWord.length) {
        this.nextLetterIndex ++;
      } else {
        this.nextWord();
        this.correctWords.push(this.rightPanelWord);
        this.rightPanelWord = '';
        this.nextLetterIndex = 0;
        this.nextLetter = '';
        this.spellingWord = '';
        this.wordPercent = 0;
      }
      console.log('next letter expected ', this.nextLetter);
    } else {
      this.capturedLetterColor = 'red';
    }

  }

  ngAfterViewInit() {
    document.dispatchEvent(new Event('ltContainerAdded'));
  }

}
