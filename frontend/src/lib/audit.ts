import pb from "./pocketbase";

export type AuditAction = 
  | "SUSPEND_USER" 
  | "UNSUSPEND_USER" 
  | "DELETE_USER" 
  | "CREATE_USER" 
  | "UPDATE_USER"
  | "HIDE_CONTENT"
  | "DELETE_CONTENT"
  | "TOGGLE_SETTINGS";

export async function logAudit(action: AuditAction, targetId: string, details?: string) {
  try {
    const adminId = pb.authStore.model?.id;
    if (!adminId) return;

    await pb.collection("audit_logs").create({
      admin: adminId,
      action,
      target_id: targetId,
      details: details || "",
    });
  } catch (err) {
    console.error("Failed to log audit action:", err);
  }
}
