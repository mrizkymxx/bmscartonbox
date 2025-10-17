
import { Separator } from "@/components/ui/separator"
import { AppearanceForm } from "./_components/appearance-form"
import AppLayout from "@/components/layout/app-layout"
import { ProtectedAction } from "@/components/protected-action"

function SettingsContent() {
    return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Appearance</h3>
            <p className="text-sm text-muted-foreground">
              Customize the appearance of the app. Switch between light and dark themes.
            </p>
          </div>
          <Separator />
          <ProtectedAction 
            resource="settings" 
            action="edit"
            fallback={
              <div className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
                View-only mode: Settings can only be changed by Admin users.
              </div>
            }
          >
            <AppearanceForm />
          </ProtectedAction>
        </div>
    )
}

export default function SettingsPage() {
  return (
    <AppLayout>
        <SettingsContent />
    </AppLayout>
  )
}
