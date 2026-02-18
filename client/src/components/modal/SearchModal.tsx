import type { ChangeEvent } from "react";
import { Modal } from "../common/Modal";
import SearchBar from "../SearchBar";

interface SearchModalProps {
  isShow: boolean;
  onHide: () => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  localSearch: string;
  closeOrClearSearchModal: () => void;
}

function SearchModal({
  isShow = false,
  onHide,
  handleSearchChange,
  isLoading,
  localSearch,
  closeOrClearSearchModal,
}: SearchModalProps) {
  return (
    <Modal
      show={isShow}
      onHide={onHide}
      isCenter={false}
      className="!max-w-94 mt-20"
    >
      <Modal.Body className="p-6">
        <SearchBar
          handleSearchChange={handleSearchChange}
          isLoading={isLoading}
          localSearch={localSearch}
          clearSearchModal={closeOrClearSearchModal}
          showClose={true}
        />
      </Modal.Body>
    </Modal>
  );
}

export default SearchModal;
