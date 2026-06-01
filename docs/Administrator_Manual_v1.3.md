# Biostateer™ Version 1.3 Administrator Manual
## Enterprise Command Center, User Auditing & Threat Telemetry

### 1. Security Administration Center Overview
Biostateer™ Version 1.3 includes an integrated, high-fidelity administrative suite that allows clinical administrators to oversee waitlists, manage license bounds, inspect mathematical verification audits, and view real-time network threat alerts.

Access to this suite is strictly role-gated. Only users registered as `Role: Administrator` can load these modules.

---

### 2. Verification Testing Credentials
For peer reviewers and validation auditors, the following default sandboxed profiles are configured for authentication:

| Role | Username / Email | Password | Intended Use Case |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@biostateer.com` | `admin123` | Control waitlists, extend licenses, review threat logs |
| **Reviewer** | `reviewer@biostateer.com` | `reviewer123` | Institutional regulatory auditor review path |
| **Evaluation User** | `eval@biostateer.com` | `eval123` | 45-day clinical trial statistical evaluation sandbox |
| **Guest** | *Public Access* | *No Password* | View gated landing page and request evaluation access |

---

### 3. User Management Dashboard (`AdminDashboard.tsx`)
The **User Management Dashboard** is the primary portal for regulating gatekeeper approvals.

#### A. Administrative Status Operations
Administrators can toggle user states with instant live updates:
* **Approve**: Unlocks the complete suite, generates a 45-day evaluation license, and sets status to `Approved`.
* **Reject**: Rejects waitlist requests. Sets status to `Rejected`.
* **Suspend**: Instantly blocks active accounts from accessing statistical modules. Sets status to `Suspended`.
* **Reactivate**: Reverses suspension or expiration, restoring active access.
* **Delete**: Removes user profile and associated tokens permanently from active memory.

#### B. Advanced Search Filters
To support large-scale enterprise deployments with hundreds of active evaluators, the dashboard includes dynamic filters:
* **Search Input**: Fuzzy search on Name, Email, or Organization.
* **Professional Category**: Filter by CRA, Biostatistician, Regulatory Affairs, Pharma Professional, etc.
* **Approval Status**: Filter by `Registered`, `Verified`, `Pending Approval`, `Approved`, `Expired`, `Suspended`.
* **Country**: Filter by country of registration.

#### C. Comprehensive Telemetry Panel
Clicking on any user profile reveals deep operational metadata:
* **Visitor Metrics**: Session count, login frequency, last activity timestamp.
* **Telemetry**: Count of exported reports and list of modules executed.
* **Device Footprint**: Browser client, operating system, matching IP address, and geographic region.

---

### 4. Admin Analytics Center (`AdminAnalytics.tsx`)
Renders interactive, real-time aggregate widgets tracking product usage:
* **Geography Acquisition**: Demographic distribution (e.g., USA, India, France, Japan) with percentage bar overlays.
* **Professional Segments**: Pie-chart analysis of biostatisticians, CRAs, and regulatory professionals.
* **Module Popularity Rankings**: Track which tests are run most frequently (e.g., Stratified Survival Suite, CDISC Validation Hub).
* **Telemetry Averages**: Displays active reviewers count and average session duration.

---

### 5. Security & Threat Center (`SecurityCenter.tsx`)
Monitors the network for security incidents and regulatory violations.

#### A. Interactive Security Counter Widgets
* **Failed Login Attempts**: Tracks consecutive incorrect password submissions.
* **Blocked Accounts**: Lists accounts locked due to brute force protection.
* **Suspicious Activities**: Flags concurrent geolocations or API abuse.
* **OTP Requests**: Tracks SMS/Email validation volumes.

#### B. Real-Time Threat Alerts Log
A security telemetry list automatically flags the following threat matrices:
1. **Multiple IP Access**: Triggered when a user credential accesses the platform from multiple distinct IP addresses within a short window (possible credential/account sharing).
2. **Rapid Login Attempts**: Identifies potential brute-force or credential stuffing bots.
3. **Credential Stuffing**: Repeated trials of common password dictionary phrases.
4. **Geoconcurrency Warning**: Impossible travel warnings (e.g., login from Mumbai followed by login from Boston 10 minutes later).

---

### 6. License Life Extension Commands
Administrators can easily modify an active evaluator's expiration parameters:
* **Extend 30 Days**: Increments active license by 30 days.
* **Extend 60 Days**: Increments active license by 60 days.
* **Extend 90 Days**: Increments active license by 90 days.
* **Custom Extension**: Specify a specific date matching project review deadlines.
