import { Button, CloseButton, Dialog, IconButton, Portal, useDialog, Text, UseDialogReturn } from "@chakra-ui/react";
import { useContext } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { DrawStateContext } from "@/contexts/draw-state";

interface ResetControlProps {
  pl?: number;
  rotated?: boolean;
  scale: number;
}

export function ResetControl(props: ResetControlProps) {
  const dialog = useDialog();
  const rotatedProps = props.rotated ? {
    transform: "rotate(90deg)",
    transformOrigin: "center center",
  } : {};
  return (
    <Dialog.RootProvider value={dialog} placement="center">
      <Dialog.Trigger asChild>
        <Button
          onClick={(e) => { e.stopPropagation(); }}
          variant="ghost"
          py="0px"
          px={`clamp(4px, calc(20px * (${props.scale-0.5})), 12px)`}
          paddingLeft={props.pl}
          height="100%"
        >
          <LuRefreshCw style={{
            width: `clamp(16px, calc(24px * ${props.scale}), 20px)`, 
            height: `clamp(16px, calc(24px * ${props.scale}), 20px)`
          }} />
          <Text fontSize={`clamp(8px, calc(20px * ${props.scale}), 16px)`}>重置</Text>
        </Button>
      </Dialog.Trigger>
      <ResetDialogContent dialog={dialog} rotated={props.rotated} />
    </Dialog.RootProvider>
  );
}

export function ResetControlWide(props: ResetControlProps) {
  const dialog = useDialog();
  const rotatedProps = props.rotated ? {
    transform: "rotate(90deg)",
    transformOrigin: "center center",
  } : {};
  return (
    <Dialog.RootProvider value={dialog} placement="center">
      <Dialog.Trigger asChild>
        <Button
          onClick={(e) => { e.stopPropagation(); }}
          variant="ghost"
          py="0px"
          px={`clamp(4px, calc(20px * (${props.scale-0.5})), 12px)`}
          paddingLeft={props.pl}
          {...rotatedProps}
        >
          <LuRefreshCw style={{
            width: `clamp(16px, calc(24px * ${props.scale}), 20px)`, 
            height: `clamp(16px, calc(24px * ${props.scale}), 20px)`
          }}/>
        </Button>
      </Dialog.Trigger>
      <ResetDialogContent rotated={props.rotated} dialog={dialog} />
    </Dialog.RootProvider>
  );
}

interface ResetDialogContentProps {
  dialog: UseDialogReturn
  rotated?: boolean;
}

function ResetDialogContent(props: ResetDialogContentProps) {
  const { resetLevelMap, clearStickers } = useContext(DrawStateContext);
  const rotatedProps = props.rotated ? {
    transform: "rotate(90deg)",
    transformOrigin: "center center",
  } : {};
  const onResetButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    resetLevelMap();
    clearStickers();
    props.dialog.setOpen(false);
    e.stopPropagation();
  };
  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content {...rotatedProps}>
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
  );
}