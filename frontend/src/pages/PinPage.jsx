import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MdBookmark, MdEdit, MdMoreHoriz, MdSend, MdDelete } from 'react-icons/md'
import { PinData } from '../context/PinContext'
import { Loading } from '../components/Loading'

const Avatar = ({ src, alt, fallback }) => (
  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-500">{fallback}</div>
    )}
  </div>
)

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "font-semibold rounded-full transition-colors duration-200 flex items-center justify-center"
  const variants = {
    primary: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100"
  }
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }
  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 ${className}`}
    {...props}
  />
)

const ScrollArea = ({ className = '', children }) => (
  <div className={`overflow-y-auto ${className}`}>
    {children}
  </div>
)

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
        <div className="mb-4 text-center">
          <p className="text-lg font-semibold mb-2">Confirm Delete</p>
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

function PinDetail({ user }) {
  const params = useParams()
  const navigate = useNavigate()
  const { loading, fetchPin, pin, updatePin, addComment, deleteComment, deletePin } = PinData()

  const [edit, setEdit] = useState(false)
  const [title, setTitle] = useState("")
  const [pinValue, setPinValue] = useState("")
  const [comment, setComment] = useState("")

  // Modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, type: null, commentId: null })

  // --- Save Pin Section ---
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (pin && user && pin._id) {
      setSaved(user.savedPins && user.savedPins.includes(pin._id));
    }
  }, [pin, user]);

  const handleSavePin = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pin/save/${pin._id}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      setSaved(data.saved);
    } catch (err) {
      // Optionally show error
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPin(params.id)
  }, [params.id])

  useEffect(() => {
    if (pin) {
      setTitle(pin.title)
      setPinValue(pin.pin)
    }
  }, [pin])

  const editHandler = () => {
    setEdit(!edit)
  }

  const updateHandler = () => {
    updatePin(pin._id, title, pinValue, setEdit)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    addComment(pin._id, comment, setComment)
  }

  const deleteCommentHandler = (id) => {
    setDeleteModal({ open: true, type: 'comment', commentId: id })
  }

  const deletePinHandler = () => {
    setDeleteModal({ open: true, type: 'pin', commentId: null })
  }

  const handleModalClose = () => {
    setDeleteModal({ open: false, type: null, commentId: null })
  }

  const handleModalConfirm = () => {
    if (deleteModal.type === 'comment') {
      deleteComment(pin._id, deleteModal.commentId)
    } else if (deleteModal.type === 'pin') {
      deletePin(pin._id, navigate)
    }
    handleModalClose()
  }

  if (loading) return <Loading />

  return (
    <div className="container mx-auto px-4 py-11 mt-20 min-h-screen">
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        message={
          deleteModal.type === 'comment'
            ? 'Are you sure you want to delete this comment?'
            : 'Are you sure you want to delete this pin?'
        }
      />
      {pin && (
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative aspect-square">
            {pin.image && (
              <img
                src={pin.image.url}
                alt={pin.title}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {pin.owner && (
                  <Link to={`/user/${pin.owner._id}`}>
                    <Avatar src={pin.owner.avatar} alt={pin.owner.name} fallback={pin.owner.name.slice(0, 1)} />
                  </Link>
                )}
                <div>
                  <h3 className="font-semibold">{pin.owner ? pin.owner.name : 'Unknown'}</h3>
                  <p className="text-sm text-gray-500">{pin.owner ? `${pin.owner.followers.length} Followers` : ''}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {pin.owner && pin.owner._id === user._id ? (
                  <>
                    <Button variant="outline" size="sm" onClick={editHandler}>
                      <MdEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={deletePinHandler}>
                      <MdDelete className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button variant={saved ? 'primary' : 'outline'} size="sm" onClick={handleSavePin} disabled={saving}>
                    <MdBookmark className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MdMoreHoriz className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              {edit ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title"
                />
              ) : (
                <h1 className="text-2xl font-bold mb-2">{pin.title}</h1>
              )}
              {edit ? (
                <Input
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value)}
                  placeholder="Enter Description"
                />
              ) : (
                <p className="text-gray-600 mb-4">{pin.pin}</p>
              )}
              {edit && (
                <Button onClick={updateHandler} className="mt-2">
                  Update
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <MdBookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="p-2">
                <MdSend className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <h2 className="font-semibold">Comments</h2>
              <form onSubmit={submitHandler} className="flex gap-2">
                <Input 
                  placeholder="Add a comment..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <Button type="submit">Post</Button>
              </form>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {pin.comments && pin.comments.length > 0 ? (
                    pin.comments.map((comment) => (
                      <div key={comment._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Link to={`/user/${comment.user}`}>
                            <Avatar src={comment.avatar} alt={comment.name} fallback={comment.name.slice(0, 1)} />
                          </Link>
                          <div>
                            <p className="font-semibold text-sm">{comment.name}</p>
                            <p className="text-sm text-gray-700">{comment.comment}</p>
                          </div>
                        </div>
                        {comment.user === user._id && (
                          <Button variant="outline" size="sm" onClick={() => deleteCommentHandler(comment._id)}>
                            <MdDelete className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Be the first one to add a comment</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PinDetail