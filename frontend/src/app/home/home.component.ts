import { Component } from '@angular/core';

interface ScrollingElement {
  container: HTMLDivElement;
  list: HTMLUListElement;
  leftArrow: HTMLButtonElement;
  rightArrow: HTMLButtonElement;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  items = ['Item 1', 'Item 2', 'Item 3']; // Replace with your actual data
  scroller: ScrollingElement | null = null;

  ngOnInit() {
    this.initializeScroller();
  }

  initializeScroller() {
    const container = document.querySelector('.scrolling-container') as HTMLDivElement;
    if (!container) {
      return; // Handle potential missing element
    }

    const list = container.querySelector('ul') as HTMLUListElement;
    const leftArrow = document.querySelector('.left-arrow') as HTMLButtonElement;
    const rightArrow = document.querySelector('.right-arrow') as HTMLButtonElement;

    const itemsWidth = list.querySelector('li')!.offsetWidth; // Get item width

    function scrollRight() {
      container.scrollLeft += itemsWidth;
      leftArrow.disabled = false;
      rightArrow.disabled = container.scrollLeft >= list.scrollWidth - container.clientWidth;
    }

    function scrollLeft() {
      container.scrollLeft -= itemsWidth;
      rightArrow.disabled = false;
      leftArrow.disabled = container.scrollLeft === 0;
    }

    leftArrow.addEventListener('click', scrollLeft);
    rightArrow.addEventListener('click', scrollRight);

    // Initially disable the left arrow as we start from the beginning
    leftArrow.disabled = true;

    this.scroller = { container, list, leftArrow, rightArrow };
  }
}
