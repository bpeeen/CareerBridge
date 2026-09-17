export interface StateDistrictData {
  state: string;
  districts: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistrictData[] = [
  {
    state: 'Jharkhand',
    districts: ['Ranchi', 'Dhanbad', 'East Singhbhum (Jamshedpur)', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Dumka', 'Ramgarh', 'Palamu', 'Khunti']
  },
  {
    state: 'Bihar',
    districts: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Begusarai', 'Nalanda', 'Rohtas', 'Saran']
  },
  {
    state: 'Uttar Pradesh',
    districts: ['Lucknow', 'Kanpur', 'Varanasi', 'Noida (Gautam Buddha Nagar)', 'Agra', 'Prayagraj', 'Ghaziabad', 'Gorakhpur', 'Bareilly', 'Meerut']
  },
  {
    state: 'Maharashtra',
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Chhatrapati Sambhajinagar', 'Solapur', 'Amravati', 'Kolhapur']
  },
  {
    state: 'Rajasthan',
    districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bhilwara', 'Sikar']
  },
  {
    state: 'Madhya Pradesh',
    districts: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Satna', 'Rewa']
  },
  {
    state: 'West Bengal',
    districts: ['Kolkata', 'Howrah', 'Siliguri', 'Asansol', 'Durgapur', 'Murshidabad', 'North 24 Parganas', 'Hooghly']
  },
  {
    state: 'Gujarat',
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Kutch']
  },
  {
    state: 'Karnataka',
    districts: ['Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Tumakuru', 'Udupi']
  },
  {
    state: 'Tamil Nadu',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Vellore', 'Erode']
  },
  {
    state: 'Telangana',
    districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Rangareddy']
  },
  {
    state: 'Andhra Pradesh',
    districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kurnool', 'Kakinada']
  },
  {
    state: 'Delhi',
    districts: ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'West Delhi', 'East Delhi']
  },
  {
    state: 'Odisha',
    districts: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore']
  },
  {
    state: 'Punjab',
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)']
  },
  {
    state: 'Haryana',
    districts: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak']
  },
  {
    state: 'Assam',
    districts: ['Guwahati (Kamrup Metro)', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon']
  },
  {
    state: 'Kerala',
    districts: ['Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur']
  },
  {
    state: 'Uttarakhand',
    districts: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Nainital', 'Udhamsingh Nagar']
  },
  {
    state: 'Chhattisgarh',
    districts: ['Raipur', 'Bhilai (Durg)', 'Bilaspur', 'Korba', 'Rajnandgaon']
  }
];

export function getDistrictsForState(stateName: string): string[] {
  const found = INDIAN_STATES_DISTRICTS.find(
    (s) => s.state.toLowerCase() === stateName.toLowerCase()
  );
  return found ? found.districts : ['Central', 'North', 'South', 'East', 'West'];
}
