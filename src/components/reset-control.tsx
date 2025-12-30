import { Button, CloseButton, Dialog, IconButton, Portal, useDialog, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { DrawStateContext } from "@/contexts/draw-state";

export function ResetControl() {
  const dialog = useDialog();
  const { resetLevelMap, clearStickers } = useContext(DrawStateContext);
  const onResetButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    resetLevelMap();
    clearStickers();
    dialog.setOpen(false);
    e.stopPropagation();
  };
  return (
    <Dialog.RootProvider value={dialog}>
      <Dialog.Trigger asChild>
        <Button 
          onClick={(e) => {e.stopPropagation();}}
          variant="ghost"
          padding="4px 12px"
        >
          <LuRefreshCw/> 重置
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop/>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>请确认</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text textStyle="xl">清空地图数据和表情？</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">取消</Button>
              </Dialog.ActionTrigger>
              <Button onClick={onResetButtonClick}>确认</Button>
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
