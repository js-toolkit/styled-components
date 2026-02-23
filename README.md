# @js-toolkit/styled-components

[![npm package](https://img.shields.io/npm/v/@js-toolkit/styled-components.svg?style=flat-square)](https://www.npmjs.org/package/@js-toolkit/styled-components)
[![license](https://img.shields.io/npm/l/@js-toolkit/styled-components.svg?style=flat-square)](https://www.npmjs.org/package/@js-toolkit/styled-components)

Styled React components powered by [@mui/system/styled](https://mui.com/system/getting-started/). Includes modal, dropdown, notifications, tooltips, buttons, forms, and more.

## Install

```bash
yarn add @js-toolkit/styled-components
# or
npm install @js-toolkit/styled-components
```

Requires `react >= 19` and `@mui/system` as peer dependencies.

## Components

### Layout and Display

| Component | Description |
|-----------|-------------|
| `Modal` | Modal dialog with Header, Body, Footer |
| `DropDown` | Dropdown menu with context |
| `DropDownLabel` | Dropdown trigger label |
| `DropDownBox` | Dropdown content container |
| `Tooltip` | Tooltip component |
| `Tooltipable` | HOC for adding tooltip to any component |
| `Divider` | Divider line |
| `TransitionFlex` | Flex with transition support |
| `TransitionWrapper` | Wrapper with transition animations |
| `SuspenseFallback` | Suspense fallback with delay |
| `ErrorBoundary` | Error boundary component |
| `ResizeListener` | Element resize detection |

### Forms and Inputs

| Component | Description |
|-----------|-------------|
| `Button` | Styled button |
| `LoadableButton` | Button with loading state |
| `TooltipButton` | Button with tooltip |
| `Checkbox` | Checkbox/radio/switch |
| `CheckboxGroup` | Grouped checkboxes |
| `InputGroup` | Input wrapper with error display |
| `Field` | Form field with label and helper |

### Notifications

| Component | Description |
|-----------|-------------|
| `Notifications` | Notification system |
| `NotificationBar` | Individual notification bar |
| `NotificationCloseAction` | Close button for notifications |

### Content

| Component | Description |
|-----------|-------------|
| `Avatar` | Avatar with image fallback |
| `Badge` | Badge with count |
| `Picture` | Image with loading states |
| `Poster` | Poster with low-quality placeholder |
| `TruncatedText` | Text truncation |
| `HighlightedText` | Text highlighting |
| `HiddenIFrame` | Hidden iframe for resize detection |

### Menu

| Component | Description |
|-----------|-------------|
| `MenuList` | Menu list |
| `MenuSelectList` | Selectable menu list |
| `MenuListItem` | Menu list item |

### Fonts

| Component | Description |
|-----------|-------------|
| `RobotoFont` | Roboto font loader |
| `RalewayFont` | Raleway font loader |

### Utilities

| Component | Description |
|-----------|-------------|
| `LoadableFlex` | Flex container with loading state |
| `Transition` | Transition wrapper |

## Usage Examples

### Modal

```tsx
import { Modal } from '@js-toolkit/styled-components/Modal';

function Settings({ open, onClose }: { open: boolean; onClose: () => void }): React.JSX.Element {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Body>Content here</Modal.Body>
      <Modal.Footer>
        <button type="button" onClick={onClose}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}
```

### LoadableButton

```tsx
import { LoadableButton } from '@js-toolkit/styled-components/LoadableButton';

function SubmitButton({ loading }: { loading: boolean }): React.JSX.Element {
  return (
    <LoadableButton loading={loading} type="submit">
      Save
    </LoadableButton>
  );
}
```

### DropDown

```tsx
import { DropDown, DropDownLabel, DropDownBox } from '@js-toolkit/styled-components/DropDown';

function Menu(): React.JSX.Element {
  return (
    <DropDown>
      <DropDownLabel>Open menu</DropDownLabel>
      <DropDownBox>
        <div>Item 1</div>
        <div>Item 2</div>
      </DropDownBox>
    </DropDown>
  );
}
```

## Repository

[https://github.com/js-toolkit/styled-components](https://github.com/js-toolkit/styled-components)
