// All Type Definitions - Single source of truth
// Edit this file when the API structure changes

// ===== API Response Types (from backend) =====

// Member Points Model
export interface ApiMemberPoints {
  member_id: number
  member_name: string
  total_points: number | null
  uni_id: string | null
}

export type ApiMembersPointsResponse = ApiMemberPoints[]

// Department Points Model
export interface ApiDepartmentPoints {
  department_id: number
  department_name: string
  ar_department_name: string
  department_type: string
  total_points: number
}

export interface ApiDepartmentsPointsResponse {
  administrative: ApiDepartmentPoints[]
  practical: ApiDepartmentPoints[]
}

// Public club structure (sanitized display data from the admin app)
export interface PublicClubDepartment {
  id: number
  name: string
  ar_name: string
  type: 'administrative' | 'practical'
  color: string
  icon: string
  show_in_leaderboard: boolean
  leadership_enabled: boolean
  leader: string | null
  deputy: string | null
  members: string[]
}

export interface PublicClubSemester {
  code: number
  gregorian_code: number
  name: string
}

export interface PublicClubStructure {
  semester: PublicClubSemester
  presidents: string[]
  departments: PublicClubDepartment[]
}


// Event Model (for points history)
export interface ApiPointsEvent {
  event_name: string
  event_id: number
  start_datetime: string
  end_datetime: string
  points: number
  action_name: string
  ar_action_name: string | null
  /** 'online' / 'on-site' events have leaderboard pages; 'none' entries come from the points pages. */
  location_type: 'online' | 'on-site' | 'none'
  /** true when every action in this history row is a bonus action */
  bonus_row?: boolean
}

// Member Event History Response
export interface ApiMemberPointsHistory {
  member: ApiMemberPoints
  events: ApiPointsEvent[]
}

// Department Event History Response
export interface ApiDepartmentPointsHistory {
  department: ApiDepartmentPoints
  events: ApiPointsEvent[]
}

// ===== Internal App Types (transformed from API) =====

export interface Member {
  id: string
  name: string
  totalPoints: number
  rank: number
  departmentId: string
  isManager: boolean
}

export interface Department {
  id: string
  name: string
  totalPoints: number
  rank: number
  type?: 'administrative' | 'practical'
}

export interface PointsHistoryEntry {
  id: string
  date: string
  source: string
  points: number
  entityId: string // member or department ID
  entityType: "member" | "department"
}

export interface LeaderboardSummary {
  topMembers: Member[]
  topDepartments: Department[]
  totalMembers: number
  totalDepartments: number
}

// ===== Backward Compatibility Aliases =====
// These map the new API types to the old names used in the codebase

export type ApiMember = ApiMemberPoints
export type ApiMembersResponse = ApiMembersPointsResponse
export type ApiDepartment = ApiDepartmentPoints
export type ApiDepartmentsResponse = ApiDepartmentsPointsResponse
export type ApiEvent = ApiPointsEvent
export type ApiMemberDetail = ApiMemberPointsHistory
export type ApiDepartmentDetail = ApiDepartmentPointsHistory

// ===== Events Types =====

export type EventStatus = "draft" | "published" | "cancelled"

/** Derived server-side from Riyadh wall-clock time. */
export type EventPhase = "upcoming" | "live" | "ended"

export type RegistrationStatus = "not_open" | "open" | "closed"

/** Derived server-side from event status, phase, and form registration settings/window. */
export type EffectiveRegistrationStatus = "none" | "not_open" | "open" | "closed"

export type EventFormType = "none" | "registration" | "google"

export type MeetingUrlVisibility = "public" | "accepted" | "hidden"

/** How much prior knowledge an event assumes. */
export type EventLevel = "beginner" | "intermediate" | "advanced"

export interface ApiEventItem {
  id: number
  name: string
  description: string | null
  location_type: "online" | "on-site" | "none" | "hidden"
  location: string
  start_datetime: string
  end_datetime: string
  status: EventStatus
  level: EventLevel
  image_url: string | null
  /** Join link for remote events, set by an admin. Null when hidden/restricted or unset. */
  meeting_url: string | null
  meeting_url_visibility?: MeetingUrlVisibility
  created_at: string | null
  published_at?: string | null
  cancelled_at?: string | null
  phase?: EventPhase | null
  /** Published content links, attached server-side. Unpublished rows never arrive. */
  content_links?: ApiEventContentLink[]
  form_id?: number | null
  form_type?: EventFormType | null
  registration_status?: RegistrationStatus | null
  effective_registration_status?: EffectiveRegistrationStatus
  is_registration_open?: boolean
  google_responders_url?: string | null
}

export interface ApiOpenEventItem extends ApiEventItem {
  form_type: EventFormType
  form_id: number
  google_responders_url: string | null
  registration_status?: RegistrationStatus | null
  effective_registration_status: EffectiveRegistrationStatus
  is_registration_open: boolean
}

export interface ApiMySubmissionItem {
  submission_id: number
  form_id: number
  event_id: number
  submission_type: "none" | "partial" | "google" | "registration"
  submitted_at: string
  is_accepted: boolean
  is_invited: boolean
  meeting_url?: string | null
}

export type ApiEventsResponse = ApiEventItem[]
export type ApiOpenEventsResponse = ApiOpenEventItem[]

// A link to event content (slides, recordings) an admin pasted in. The label
// is the display name members see - never the Drive/YouTube filename behind it.
export interface ApiEventContentLink {
  id: string
  label: string
  url: string
  kind: 'slides' | 'recording' | 'other'
  published: boolean
  /** Direct-download URL for Drive-hosted files, derived server-side. Null (or
   * absent) keeps the row Open-only - never a broken Download action. */
  download_url?: string | null
}

// ===== Submission Types =====

export type SubmissionStatus = false | true | 'partial'

// Type for the submission_type query parameter sent to the API
export type SubmissionType = 'none' | 'partial'

export interface ApiSubmissionResponse {
  submission_status: SubmissionStatus
  submission_timestamp?: string
  is_accepted?: boolean
  meeting_url?: string | null
}

// ===== Semesters Types =====

export interface ApiSemestersResponse {
  current_semester: number
  semesters: number[]
}

// ===== Attendance Types =====

export interface AttendanceResponse {
  success: boolean
  status: number
  message?: string
}

// ===== Current Member Types =====

export interface CurrentMember {
  id: number
  name: string
  public_name: string
  email: string
  phone_number: string | null
  uni_id: string | null
  gender: 'Male' | 'Female'
  uni_level: number | null
  uni_college: string | null
  created_at: string | null
  updated_at: string | null
  is_authenticated: boolean | null
}

export interface UpdateMemberData {
  name?: string
  public_name?: string
  email?: string
  phone_number?: string
  gender?: 'Male' | 'Female'
  uni_level?: number | null
  uni_college?: string | null
}

export interface AttendanceDate {
  date: string
  attended: boolean
}

export interface ApiMyEventItem extends ApiEventItem {
  is_official: number
  attendance_dates: AttendanceDate[]
}

export interface ApiMyEventsResponse {
  attended: ApiMyEventItem[]
  participated: ApiMyEventItem[]
}
