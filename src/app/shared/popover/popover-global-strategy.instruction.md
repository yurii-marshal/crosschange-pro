### POPOVER: GLOBAL STRATEGY

this.popoverService.show(data, config); 
####Call function in some component
<br/>openPopupNotification(note: Notification): void {
<br/>    this.popoverService.show({
<br/>      content: note,
<br/>    }, {positionOffset: {top: 84, bottom: 20}});
<br/>  }

All data and configuration properties are optional

#####Data properties
| Prop            | Default | Description |
| ----------------- | ------- | ----------- |
| content    |  undefined   | string / object - Text to show in component template  |
| component    |  PopoverGlobalTemplateComponent   | componentRef - Component for popover container |
| duration    |  3000   | number - Duration to show the popover  |

#####Configuration properties
| Prop            | Default | Description |
| ----------------- | ------- | ----------- |
| type   |  'success'   | 'warning' / 'info' / 'success' - Add any type string to show distinguishing view  |
| scrollStrategy   |  'block'   | 'noop' / 'block' / 'reposition' / 'close' - CDK scroll strategy to handle popover align on scroll  |
| stackStrategy   |  'stack'   | 'stack' / 'restart' - Global Popover strategy on open: close previous or keep both on screen  |
| horizontalAlign   |  'right'   | 'left' / 'center' / 'right'  |
| verticalAlign   |  'top'   | 'top' / 'center' / 'bottom'  |
| forceAlignment   |  true   | boolean - Keep align on scroll  |
| lockAlignment   |  false   | boolean - Keep align on screen resize  |
| positionOffset   |  0, 0, 0, 0, 'px', 'px'   | top?: number, bottom?: number left?: number, right?: number, vType?: 'px' / '%', hType?: 'px' / '%' - Offset for current alignment |
| animation   |  500, 500   | transitionStart, transitionEnd - Animation duration on the start, on the end  |
| hasBackdrop   |  false   | boolean - Has popover backdrop background or not  |
| backdropClass   |  cdk-overlay-transparent-backdrop   | string  |
| panelClass   |  popover-dialog-panel   | string - Global class for CDK overlay child |

Animations of a global popover can be added to component accordingly in typical way (in a decorator)
