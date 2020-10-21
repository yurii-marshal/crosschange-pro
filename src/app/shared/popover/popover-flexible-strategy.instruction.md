###POPOVER: FLEXIBLE STRATEGY
###Selector <app-popover-template>
`app-popover-template` This component provides a popover as defined by UX Wireframes.

### Inputs
<br/>[placement] - Set alignment of the popover accordingly to an anchor ('top', 'top-left', 'top-right', 'bottom' (default), 'bottom-left', 'bottom-right', 'left', 'left-top', 'left-bottom', 'right', 'right-top', 'right-bottom')
<br/>'top-left', 'top-right', 'bottom-left', 'bottom-right' are positioned above and below as well and connected to the corner of anchor due to placement value

<br/>[hasBackdrop] - Add a fullscreen backdrop that appears behind the popover when it is open.

<br/>forceAlignment - Whether the popover always displays with the alignment you've specified (boolean, 'true' by default)
<br/>lockAlignment - Whether the popover does not change its alignment once opened (boolean, 'true' by default)

<br/>scrollStrategy - The popover will/won't reposition itself to stay attached to its anchor ('noop' | 'block' | 'reposition' | 'close')

### Methods 

Popover

| Method        | Description |
| ------------- | ----------- |
| ref.open()    | Open the popover.  |
| ref.close()   | Close the popover. Optionally takes a value.  |
| ref.toggle()  | Toggle the popover open or closed.  |
| ref.isOpen()  | Get whether the popover is presently open.  |
| ref.realign() | Realign the popover to the anchor.  |

Anchor

| Method              | Description |
| ------------------- | ----------- |
| ref.openPopover()   | Open the popover.  |
| ref.closePopover()  | Close the popover. Optionally takes a value.  |
| ref.togglePopover() | Toggle the popover open or closed.  |
| ref.isPopoverOpen() | Get whether the popover is presently open.  |
| ref.realignPopover()| Realign the popover to the anchor.  |
| ref.getElement()    | Get a reference to the anchor element.  |

### Outputs

Popover

| Output            | Description |
| ----------------- | ----------- |
| (opened)          | Emits when the popover is opened.  |
| (closed)          | Emits when the popover is closed.  |
| (afterOpen)       | Emits when the popover has finished opening.  |
| (afterClose)      | Emits when the popover has finished closing.  |
| (backdropClicked) | Emits when the popover's backdrop (if enabled) is clicked.  |
| (overlayKeydown)  | Emits when a keydown event is targeted to this popover's overlay.  |

Anchor

| Output            | Description |
| ----------------- | ----------- |
| (popoverOpened)   | Emits when the popover is opened.  |
| (popoverClosed)   | Emits when the popover is closed.  |

### Scrolling Strategy

| Strategy          | Description |
| ----------------- | ----------- |
| 'noop'        | Don't update position.  |
| 'block'       | Block page scrolling while open.  |
| 'reposition'  | Reposition the popover on scroll (default).  |
| 'close'       | Close the popover on scroll.  |

### Getting Start
1. If you want the popover animations to work, you must include BrowserAnimationsModule in your app.
<br/>import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
<br/>
<br/>@NgModule({
<br/>  ...
<br/>  imports: [ BrowserAnimationsModule ],
<br/>  ...
<br/>})
<br/>export class AppModule { }

2. If you prefer to not have animations, you can include NoopAnimationsModule.
<br/>import { NoopAnimationsModule } from '@angular/platform-browser/animations';
<br/>
<br/>@NgModule({
<br/>  ...
<br/>  imports: [ NoopAnimationsModule ],
<br/>  ...
<br/>})
<br/>export class AppModule { }

3. Finally, import the PopoverModule to provide the necessary components and directives.
<br/>import { PopoverModule } from 'appPopover';
<br/>
<br/>@NgModule({
<br/>  ...
<br/>  imports: [ PopoverModule ],
<br/>  ...
<br/>})
<br/>export class AppModule { }

4. A template reference variable #myPopoverInstant is required for using attributes
<br/><app-popover #contactPopover>
<br/>  <!-- Provide template or any component here -->
<br/></app-popover>

### In html:
```
<!-- Anchor (only one for popover instant) -->
<button appPopover="refPopover" (click)="refPopover.open()">Open</button>
<!-- <button (click)="refPopover.close()">Close</button> -->
<!-- <button (click)="refPopover.toggle()">Toggle</button> -->
{{contactPopover.isOpen()}}
<!-- Popover template-->
<app-popover-template
      #refPopover
      [placement]="'top-left'"
      [hasBackdrop]="true"
      [forceAlignment]="false"
      scrollStrategy="block"
      (opened)="onPopoverOpened()"
      (closed)="onPopoverClosed()"
      (afterOpen)="onPopoverAfterOpen()"
      (afterClose)="onPopoverAfterClose()"
      (backdropClicked)="onPopoverBackdropClicked()"
      (overlayKeydown)="onPopoverOverlayKeydown()"
     >
        <div appPopoverHeader class="custom-styling-header">HEADER</div>
        <div class="custom-styling-body" appPopoverBody>
           Hover <span appPopoverHover>this text</span> to show tooltip immediately
        </div>
        <div class="custom-styling-footer" appPopoverFooter>FOOTER</div>
</app-popover-template>
