import { Container } from '@mikrokit/di'
import { PasswordRestoreService } from '@services/password-restore.service'

export const initPasswordRestore = async (
  contrainer: Container,
  email: string
) => {
  const passwordRestoreService = await contrainer.inject(PasswordRestoreService)

  await passwordRestoreService.initPasswordRestoreByEmail(email)
}
