interface Common {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CenterType extends Common {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profilePic?: string; // Optional property
  timeZone?: string;
  media_sharing_delay?: number;
  autoReportSend?: number;
  tax_id: string;
  address: string;
  country: string;
  city: string;
  state: string;
  zip: string;
  parent_signin_identification?: number; // Optional property
  child_name_display?: number; // Optional property
  parent_signin?: boolean;
  safePickup?: boolean;
  classroom_access?: boolean;
  teacher_editable_timecard?: boolean;
  full_week_center?: boolean;
  dob: Date;
  pob: string;
  isActive?: boolean; // Optional property
  lastActive?: Date; // Optional property

}