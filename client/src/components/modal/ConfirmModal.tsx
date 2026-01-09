import { Button, Modal } from "../common/Modal";

interface ConfirmModalProps {
  isShow: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

function ConfirmModal({
  isShow = false,
  title = "",
  description = "",
  onClose,
  onConfirm,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal show={isShow} onHide={onClose} className="!max-w-94">
      <Modal.Header closeButton onClose={onClose}>
        <Modal.Title>
          <div className="py-2">{title}</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-6 mb-4">
        <p className="text-base text-slate-600">{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
          Yes, I'm sure
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
