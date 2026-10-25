export type PresetRole = "siswa" | "guru";

export const presetAccounts = [
  { username: "siswa01", password: "Ruang#Siswa01", role: "siswa" },
  { username: "siswa02", password: "Ruang#Siswa02", role: "siswa" },
  { username: "siswa03", password: "Ruang#Siswa03", role: "siswa" },
  { username: "siswa04", password: "Ruang#Siswa04", role: "siswa" },
  { username: "siswa05", password: "Ruang#Siswa05", role: "siswa" },
  { username: "siswa06", password: "Ruang#Siswa06", role: "siswa" },
  { username: "siswa07", password: "Ruang#Siswa07", role: "siswa" },
  { username: "siswa08", password: "Ruang#Siswa08", role: "siswa" },
  { username: "siswa09", password: "Ruang#Siswa09", role: "siswa" },
  { username: "siswa10", password: "Ruang#Siswa10", role: "siswa" },
  { username: "siswa11", password: "Ruang#Siswa11", role: "siswa" },
  { username: "siswa12", password: "Ruang#Siswa12", role: "siswa" },
  { username: "siswa13", password: "Ruang#Siswa13", role: "siswa" },
  { username: "siswa14", password: "Ruang#Siswa14", role: "siswa" },
  { username: "siswa15", password: "Ruang#Siswa15", role: "siswa" },
  { username: "siswa16", password: "Ruang#Siswa16", role: "siswa" },
  { username: "siswa17", password: "Ruang#Siswa17", role: "siswa" },
  { username: "siswa18", password: "Ruang#Siswa18", role: "siswa" },
  { username: "siswa19", password: "Ruang#Siswa19", role: "siswa" },
  { username: "siswa20", password: "Ruang#Siswa20", role: "siswa" },
  { username: "siswa21", password: "Ruang#Siswa21", role: "siswa" },
  { username: "siswa22", password: "Ruang#Siswa22", role: "siswa" },
  { username: "siswa23", password: "Ruang#Siswa23", role: "siswa" },
  { username: "siswa24", password: "Ruang#Siswa24", role: "siswa" },
  { username: "siswa25", password: "Ruang#Siswa25", role: "siswa" },
  { username: "siswa26", password: "Ruang#Siswa26", role: "siswa" },
  { username: "siswa27", password: "Ruang#Siswa27", role: "siswa" },
  { username: "siswa28", password: "Ruang#Siswa28", role: "siswa" },
  { username: "siswa29", password: "Ruang#Siswa29", role: "siswa" },
  { username: "siswa30", password: "Ruang#Siswa30", role: "siswa" },
  { username: "guru", password: "guru123", role: "guru" },
] as const satisfies readonly { username: string; password: string; role: PresetRole }[];

export function findPresetAccount(username: string) {
  return presetAccounts.find((account) => account.username === username.trim().toLowerCase());
}