import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button, Form, FormControl, Modal, ModalBody, ModalTitle } from 'react-bootstrap';

const NoteModal = ({
  noteModal,
  deleteNoteModal,
  selectedRow,
  toggleNoteModal,
  toggleDelteNoteModal,
  saveNote,
  deleteNote
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: { note: "" } });

  useEffect(() => {
    reset({
      note: selectedRow.data && selectedRow.data.note || ""
    })
  }, [selectedRow]);

  const noteValue = watch('note');

  return <>
    <Modal show={noteModal} centered onHide={() => toggleNoteModal(null)}>
      <Modal.Header closeButton>
        <ModalTitle className="px-4">Add Note</ModalTitle>
      </Modal.Header>
      <ModalBody className="px-5">
        <Form onSubmit={handleSubmit(saveNote)}>
          <Form.Group controlId="user-note">
            <Form.Label>Note</Form.Label>
            <FormControl
              as="textarea"
              placeholder="Enter Note (maximum 200 characters allowed)"
              name="note"
              rows={4}
              onChange={e => {
                if (e.target.value.length >= 200) {
                  const trimedValue = e.target.value.slice(0, 200);
                  setValue('note', trimedValue);
                }
              }}
              ref={register}
            />
            {noteValue && noteValue.length >= 150 && <p className="form-error text-muted">{(200 - noteValue.length)} characters left</p>}
          </Form.Group>
          <div className="button-container">
            <Button variant="primary" type="submit" className="mx-2">{selectedRow.isEdit ? 'Save' : 'Add'}</Button>
            <Button variant="secondary" type="button" className="mx-2" onClick={() => toggleNoteModal(null)}>Cancel</Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
    <Modal show={deleteNoteModal} onHide={() => toggleDelteNoteModal(null)}>
      <Modal.Header closeButton>
        <ModalTitle className="px-4">Delete Note</ModalTitle>
      </Modal.Header>
      <ModalBody className="px-5">
        <p>Are you sure you want to delete this note?</p>
        <div className="button-container">
          <Button variant="primary" type="button" className="mx-2" onClick={() => deleteNote()}>Delete</Button>
          <Button variant="secondary" type="button" className="mx-2" onClick={() => toggleDelteNoteModal(null)}>Cancel</Button>
        </div>
      </ModalBody>
    </Modal>
  </>
}

export default NoteModal;