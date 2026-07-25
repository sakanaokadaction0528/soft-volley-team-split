import { useState } from 'react';
import type { Member } from '../types';
import Modal from './Modal';

type Props = {
  members: Member[];
  onRename: (id: string, newName: string) => string | null;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export default function MemberManagement({ members, onRename, onDelete, onClose }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [editError, setEditError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  const startEdit = (member: Member) => {
    setEditingId(member.id);
    setDraftName(member.name);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName('');
    setEditError('');
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = draftName.trim();
    if (!trimmed) {
      setEditError('名前を入力してください');
      return;
    }
    const error = onRename(editingId, trimmed);
    if (error) {
      setEditError(error);
      return;
    }
    cancelEdit();
  };

  return (
    <Modal title="メンバー管理" onClose={onClose}>
      {members.length === 0 ? (
        <p className="empty-message">登録されているメンバーがいません。</p>
      ) : (
        <ul className="management-list">
          {members.map((member) => (
            <li key={member.id} className="management-row">
              {editingId === member.id ? (
                <div className="management-edit">
                  <input
                    value={draftName}
                    onChange={(e) => {
                      setDraftName(e.target.value);
                      setEditError('');
                    }}
                    autoFocus
                  />
                  {editError && <p className="form-error">{editError}</p>}
                  <div className="management-edit-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                      キャンセル
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={saveEdit}>
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="management-name">{member.name}</span>
                  <div className="management-actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => startEdit(member)}>
                      名前変更
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(member)}
                    >
                      削除
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {deleteTarget && (
        <div className="confirm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <p>{deleteTarget.name}さんを削除しますか？</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                キャンセル
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  onDelete(deleteTarget.id);
                  if (editingId === deleteTarget.id) cancelEdit();
                  setDeleteTarget(null);
                }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
