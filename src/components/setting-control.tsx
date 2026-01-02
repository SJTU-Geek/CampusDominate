import { Button, CloseButton, Dialog, IconButton, Portal, useDialog } from "@chakra-ui/react";
import { LuSettings } from "react-icons/lu";

interface SettingControlProps {
  rotated?: boolean;
}

export function SettingControl(props: SettingControlProps) {
  const dialog = useDialog();
  const rotatedProps = props.rotated ? {
    transform: "rotate(90deg)",
    transformOrigin: "center, center",
  } : {};

  const onCloseButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    dialog.setOpen(false);
    e.stopPropagation();
  };

  return (
    <Dialog.RootProvider value={dialog} placement="center">
      <Dialog.Trigger asChild>
        <IconButton 
          onClick={(e) => {e.stopPropagation();}}
          variant="ghost"
          padding="4px 12px"
        >
          <LuSettings/>
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop/>
        <Dialog.Positioner>
          <Dialog.Content {...rotatedProps}>
            <Dialog.Header>
              <Dialog.Title>应用设置</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={onCloseButtonClick}>确认</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
