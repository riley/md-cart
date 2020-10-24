export const identifyTrack = ({ email, name }: { email: string, name: string }) => {
  // const payload: any = { $email: email || state.email, $first_name: name || state.billing.address.name }
  const payload = { $email: email, $first_name: name }

  console.log('identifyTrack', payload)

  if (!payload.$email) return // must send email in the first identify call

  window._learnq && window._learnq.push(['identify', payload])
}
