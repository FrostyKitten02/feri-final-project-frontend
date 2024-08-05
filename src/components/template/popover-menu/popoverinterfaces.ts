export interface PopoverBaseProps {
  setActionPopoverOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onButtonClick?: () => void;
  onModalClose?: () => void;
}
