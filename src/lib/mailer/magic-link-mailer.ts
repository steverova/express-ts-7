import { emailService } from '#lib/mailer/email.service'

export async function sendMagicLinkEmail(to: string, link: string) {
	await emailService.sendEmail({
		subject: 'Tu enlace mágico para iniciar sesión',
		to,
		variables: {
			link,
		},
		templateName: 'magic-link.template',
	})
}
