"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserCog, KeyRound, Loader2, Search } from "lucide-react"
import { resetUserPassword } from "./actions"

export function UsersClient({ initialData }: { initialData: any[] }) {
  const [users, setUsers] = useState(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Dialog State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenResetModal = (user: any) => {
    setSelectedUser(user)
    setNewPassword("")
    setIsResetModalOpen(true)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !newPassword) return

    setIsLoading(true)
    try {
      const res = await resetUserPassword(selectedUser.id, newPassword)
      if (res.success) {
        alert("Password berhasil direset.")
        setIsResetModalOpen(false)
      } else {
        alert(res.error || "Gagal mereset password")
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-500 mt-1">Kelola data pengguna dan reset password jika diperlukan.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 rounded-xl w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-600">Nama</TableHead>
                <TableHead className="font-semibold text-slate-600">Email</TableHead>
                <TableHead className="font-semibold text-slate-600">Role</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                    Tidak ada pengguna yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-[#0F172A]">{user.name}</TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E3F2FD] text-[#0053db] capitalize">
                        {user.role || 'Customer'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenResetModal(user)}
                        className="rounded-lg text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <KeyRound className="h-4 w-4 mr-2" />
                        Reset Password
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Reset Password Modal */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleResetPassword}>
            <DialogHeader>
              <DialogTitle>Reset Password Pengguna</DialogTitle>
              <DialogDescription>
                Masukkan password baru untuk pengguna <b>{selectedUser?.name}</b> ({selectedUser?.email}).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input
                  id="newPassword"
                  type="text"
                  placeholder="Masukkan password baru..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="rounded-xl border-slate-200 focus-visible:ring-[#0053db]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsResetModalOpen(false)} className="rounded-xl">
                Batal
              </Button>
              <Button type="submit" disabled={isLoading || !newPassword} className="rounded-xl bg-[#0F172A] hover:bg-[#1e293b] text-white">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Simpan Password Baru
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
