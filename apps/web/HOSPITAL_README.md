# Hospital Dashboard

Mobile-responsive hospital management interface for the Hospital Network Token (HNT) multi-hospital system.

## Features

### 1. Dashboard Tab
- Key metrics overview (patients, appointments, token balance)
- Real-time statistics (staff on duty, bed occupancy, wait times)
- Recent activity feed
- Today's performance indicators
- Quick access to common actions

### 2. Patients Tab
- Register new patients with complete demographics
- Search patients by name, MRN, or phone
- View patient list with status badges
- Patient details and medical records
- Emergency contact information
- Insurance details

### 3. Appointments Tab
- Schedule new appointments
- View daily appointment calendar
- Filter by date and search
- Appointment status tracking (scheduled, in-progress, completed)
- Department and doctor assignment
- Appointment type selection
- Real-time status updates

### 4. Payments Tab
- Accept HNT token payments from patients
- Reward patients with tokens for health achievements
- View transaction history
- Hospital wallet balance display
- QR code for easy payments
- Quick reward amounts
- Payment instructions

## Mobile Optimization

The hospital dashboard is fully optimized for mobile devices and mini apps:

### Responsive Design
- Stacked layouts on mobile (< 640px)
- Two-column grids on tablets (640px - 1024px)
- Three-column grids on desktop (> 1024px)
- Horizontal scrolling tabs on small screens
- Touch-friendly buttons (minimum 44x44px)
- Optimized form inputs for mobile

### Mobile-Specific Features
- Compact metric cards
- Collapsible sections
- Swipeable tabs
- Quick action buttons
- Minimal data entry
- Fast loading times

## Setup

### 1. Configure Contract Address
Ensure the HospitalToken contract address is set in your environment:

```bash
cd apps/web
cp .env.template .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS=0xYourDeployedContractAddress
```

### 2. Run Development Server
```bash
pnpm dev
```

Navigate to `http://localhost:3000/hospital`

## User Workflows

### Register a New Patient
1. Click "Register New Patient" button
2. Fill in personal information (name, DOB, gender)
3. Add contact details (phone, email, address)
4. Enter emergency contact information
5. Add insurance details (optional)
6. Submit to generate MRN

### Schedule an Appointment
1. Click "New Appointment" button
2. Enter patient MRN and name
3. Select department and doctor
4. Choose date and time
5. Select appointment type
6. Add notes if needed
7. Submit to schedule

### Accept Token Payment
1. Go to Payments tab
2. Select "Accept Payment"
3. Share hospital wallet address with patient
4. Patient sends HNT tokens
5. Transaction appears in history
6. Generate receipt

### Reward Patient
1. Go to Payments tab
2. Select "Reward Patient"
3. Enter patient wallet address
4. Enter reward amount
5. Select reason for reward
6. Submit to send tokens

## Token Integration

### Hospital Wallet
- Each hospital has a unique wallet address
- Receives payments from patients
- Sends rewards to patients
- Tracks all token transactions
- Real-time balance updates

### Payment Types
- **Consultation fees**: Standard appointment charges
- **Lab tests**: Laboratory service fees
- **Imaging**: Radiology and imaging fees
- **Medication**: Pharmacy charges
- **Procedures**: Surgical and procedural fees

### Reward Reasons
- Completed health screening
- Preventive care visit
- Medication adherence
- Achieved health goal
- Appointment completion
- Other custom reasons

## Data Management

### Mock Data
Currently using mock data for demonstration:
- Sample patients with MRNs
- Example appointments
- Transaction history
- Performance metrics

### Production Integration
In production, connect to:
- Hospital management system (HMS)
- Electronic health records (EHR)
- Appointment scheduling system
- Billing system
- Pharmacy system
- Lab/imaging systems

## Security & Privacy

### Access Control
- Wallet connection required
- Role-based permissions (future)
- Secure token transactions
- Encrypted patient data

### HIPAA Compliance
- Patient data protection
- Audit logging
- Access tracking
- Data encryption
- Consent management

### Best Practices
- Never share private keys
- Verify patient addresses before rewards
- Keep transaction records
- Regular security audits
- Staff training on token handling

## Components

### HospitalDashboard
- Main dashboard with metrics
- Activity feed
- Performance indicators
- Quick stats

### PatientRegistration
- Patient registration form
- Patient search and list
- Patient details view
- Status management

### AppointmentScheduling
- Appointment booking form
- Calendar view
- Status tracking
- Search and filter

### TokenPayments
- Payment acceptance
- Patient rewards
- Transaction history
- Balance display

## Tech Stack

- **Next.js 14**: App Router with React Server Components
- **Wagmi v2**: React hooks for Ethereum
- **Viem**: TypeScript Ethereum library
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible components
- **Lucide Icons**: Icon library

## File Structure

```
apps/web/src/
├── app/
│   └── hospital/
│       └── page.tsx                    # Main hospital page
├── components/
│   └── hospital/
│       ├── hospital-dashboard.tsx      # Dashboard tab
│       ├── patient-registration.tsx    # Patients tab
│       ├── appointment-scheduling.tsx  # Appointments tab
│       └── token-payments.tsx          # Payments tab
└── lib/
    └── contracts.ts                    # Contract ABI and config
```

## Future Enhancements

### Phase 1 (Current)
- ✅ Dashboard with key metrics
- ✅ Patient registration
- ✅ Appointment scheduling
- ✅ Token payments and rewards

### Phase 2
- [ ] Patient medical records
- [ ] Inter-hospital referrals
- [ ] Staff directory
- [ ] Reports and analytics

### Phase 3
- [ ] Pharmacy integration
- [ ] Lab and imaging orders
- [ ] Insurance claims
- [ ] Bed management

### Phase 4
- [ ] Emergency features
- [ ] Network coordination
- [ ] Mobile app
- [ ] Offline support

## Troubleshooting

### Wallet Not Connected
- Click "Connect Wallet" button
- Approve connection in MiniPay
- Ensure you're on correct network

### Token Balance Not Showing
- Verify contract address is correct
- Check you're on the right network
- Refresh the page
- Check wallet connection

### Transaction Failed
- Ensure sufficient CELO for gas
- Verify recipient address
- Check contract is not paused
- Try again with higher gas

## Performance Optimization

### Loading Speed
- Lazy load components
- Optimize images
- Minimize bundle size
- Use React Server Components

### Mobile Performance
- Touch-optimized interactions
- Reduced animations on mobile
- Efficient re-renders
- Optimistic UI updates

## Support

For issues or questions:
- Review `HOSPITAL_TASKS.md` for detailed feature specifications
- Check contract source in `apps/contracts/contracts/HospitalToken.sol`
- Test on Alfajores testnet first
- Report bugs with detailed steps to reproduce

## Contributing

When adding new features:
1. Follow existing component patterns
2. Ensure mobile responsiveness
3. Add proper TypeScript types
4. Test on multiple screen sizes
5. Update documentation
6. Commit with clear messages

## License

Part of the Hospital Network Token system.
