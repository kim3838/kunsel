<template>
    <div>
        <LandingWrapper>
            <div>
                <div class="mx-auto pt-4 max-w-screen-lg">

                    <div class="space-y-16 px-2">

                        <section class="mt-16 text-center">
                            <h1 class="text-4xl font-semibold font-header">
                                Kunsel ERP Features
                            </h1>
                            <h2 class="text-lg font-header subtitle-color max-w-160 mx-auto">
                                Explore our unified cloud modules: HR, automated Payroll, Inventory tracking, robust Finance analytics, and POS. Streamline your enterprise architecture.
                            </h2>
                        </section>

                        <div class="neutral-border-bottom"></div>

                        <section aria-labelledby="heading-workforce">
                            <div>
                                <h2 id="heading-workforce" class="font-header text-xl font-medium">
                                    User & Employees
                                </h2>
                                <p class="subtitle-color mt-2 text-base">
                                    Centralize all workforce identity data securely to manage profiles, official records, status, and organizational roles.
                                </p>
                            </div>

                            <div class="mt-6 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Employee Management</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Batch import with option to autogenerate user on provided office email</li>
                                        <li>Multiple sequential employment profile</li>
                                        <li>Batch assignment (department, designation, manager, payroll group, user detachment)</li>
                                        <li>Active / Inactive auto identification based on employment</li>
                                        <li>Payroll items assignment (earnings, deductions and tax) also available by batch import</li>
                                        <li>Employee grouping</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-4 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">User management</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Role-based permissions</li>
                                        <li>User creation (auto-mail credentials)</li>
                                        <li>User employee promotion to admin</li>
                                        <li>Can revoke user access by setting to inactive</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-4 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">User Features</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Mandatory secure email verification upon onboarding.</li>
                                        <li>Remote session management with "Logout of other devices" capability.</li>
                                        <li>Two-factor authentication (2FA) support via Google Authenticator.</li>
                                        <li>Self-service secure password resets</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section aria-labelledby="heading-policies" class="pt-4">
                            <div>
                                <h2 id="heading-policies" class="font-header text-xl font-medium">
                                    Policies
                                </h2>
                                <p class="subtitle-color mt-2 text-base">
                                    Maintain digital governance across your organization by accessing, enforcing, and staying compliant with automated company guidelines.
                                </p>
                            </div>

                            <div class="mt-6 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Shift & Schedule Management</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Supports regular and graveyard</li>
                                        <li>Multiple sequential shift assignment</li>
                                        <li>Holiday policy (toggleable if day off or attendance required on holiday)</li>
                                        <li>Holiday exception configuration</li>
                                        <li>Can require lunch out and lunch in if requires strict schedule</li>
                                        <li>Max overtime hours</li>
                                        <li>Auto-overtime</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-4 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Holidays</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Special, Legal, and Double</li>
                                        <li>Recurrent, active, and effective date configurable</li>
                                        <li>Forfeit holiday pay option</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-4 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Time and Attendance</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Attendance & Overtime manual import and adjustment</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-4 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Automated Leave Management System</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Leave with and without pay</li>
                                        <li>
                                            Leave settings:
                                            <ul class="pl-8">
                                                <li>Eligibility configuration (set which employment types the first period will start)</li>
                                                <li>Period options from anniversary, custom interval or calendar year</li>
                                                <li>Usage limiter</li>
                                                <li>Carry over upon new period, can limit or carry all</li>
                                                <li>Additional balance per period</li>
                                            </ul>
                                        </li>
                                        <li>Batch leave type assignment with option to override initial balance</li>
                                        <li>Multiple leave type assignment</li>
                                        <li>Leave balance adjustment (add or deduct)</li>
                                        <li>Monitor balance by period series or balance by type via Reports</li>
                                        <li>Leave date range inquiry on leave creation (auto-skips day offs, existing leaves)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section aria-labelledby="heading-approvals" class="pt-4">
                            <div>
                                <h2 id="heading-approvals" class="font-header text-xl font-medium">
                                    Request & Approval
                                </h2>
                                <p class="subtitle-color mt-2 text-base">
                                    Workflow requests with approvals and track submission status in real time to authorize official requests.
                                </p>
                            </div>

                            <div class="mt-6 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Approval Settings</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Setup approver sequence on requests (attendance adjust, leave, overtime, payroll)</li>
                                        <li>Approvers on requests (attendance adjust, leave, overtime), attendance owner will get filtered out</li>
                                        <li>On requests (attendance adjust, leave, overtime), submitter will also get filtered out from approvers</li>
                                        <li>Admin can make a request for employees</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-4 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Approval</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>An admin can approve or decline any request as long as given permission (Any request: approve and decline)</li>
                                        <li>
                                            Submitted request and awaiting my approval is available on Employee portal home and HR & Payroll portal home page:
                                            <ul class="pl-8">
                                                <li>Submitted requests: Request the employee or admin requested</li>
                                                <li>Awaiting my approval: User approval is currently waiting (approval sequence active)</li>
                                            </ul>
                                        </li>
                                        <li>All awaiting approval states can monitor via approvals page</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section aria-labelledby="heading-payroll" class="pt-12">
                            <div>
                                <h2 id="heading-payroll" class="font-header text-xl font-medium">
                                    Automated Payroll Processing, Taxes, & Compliance
                                </h2>
                                <p class="subtitle-color mt-2 text-base">
                                    Calculate salaries, taxes, and benefits automatically to process accurate disbursements and generate precise payroll.
                                </p>
                            </div>

                            <div class="mt-6 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Statutory Payroll Foundations & Formula Engines</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Monitor earnings, contributions, tax ratings, table & information via Formulas</li>
                                        <li>External tax history (Employees taxable, tax withheld, bonus from previous employers)</li>
                                        <li>Auto trigger 13th month & Reconcile on last payroll of the year (Prorate if final pay mid year)</li>
                                        <li>Auto withholding tax on semimonthly and monthly</li>
                                        <li>Tax annualization on last payroll of the year (or if final pay mid year)</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-4 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Payroll Run & Digital Slip Distribution</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Payroll generation and draft regeneration (auto mail notification upon generation complete)</li>
                                        <li>Employee final pay if stated employment profile end is within payroll period and no upcoming employment</li>
                                        <li>Draft payroll approval sequence on submission</li>
                                        <li>Auto mail pay slips upon approval complete</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="mt-4 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Comprehensive Salary Statements & Ledger Reporting</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Totals on payroll history</li>
                                        <li>Can add manual earnings or manual deductions on Draft payroll</li>
                                        <li>Salary statement has 2 breakdowns available
                                            <ul class="pl-8">
                                                <li>Overview breakdown (Statement dates status & Payroll item totals)</li>
                                                <li>Full breakdown (payroll and statement totals and per day payroll items)</li>
                                            </ul>
                                        </li>
                                        <li>CSV exportable</li>
                                        <li>Contributions and Taxes available on Reports</li>
                                        <li>Payroll item totals per day is available</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section aria-labelledby="heading-ess" class="pt-12">
                            <div>
                                <h2 id="heading-ess" class="font-header text-xl font-medium">
                                    Employee Self-Service Portal
                                </h2>
                                <p class="subtitle-color mt-2 text-base">
                                    Empower staff to monitor employee insights, payslips, leave balances & requests, or manage approvals.
                                </p>
                            </div>

                            <div class="mt-6 lining-shadow rounded-sm tint-background">
                                <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                    <h3 class="font-header text-lg">Self service and Request & Approvals</h3>
                                </div>
                                <div class="p-4">
                                    <ul class="list-disc pl-5 space-y-1 subtitle-color">
                                        <li>Current & Upcoming Shift</li>
                                        <li>Leave credits</li>
                                        <li>Attendance, Overtime, and Leave monitoring</li>
                                        <li>Leave balance adjustment history</li>
                                        <li>Salary Statements (breakdowns available)
                                            <ul class="pl-8">
                                                <li>Overview breakdown (Statement dates status & Payroll item totals)</li>
                                                <li>Full breakdown (payroll and statement totals and per day payroll items)</li>
                                            </ul>
                                        </li>
                                        <li>Payroll Daily time record</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div class="my-12 neutral-border-bottom"></div>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

useHead({titleTemplate: (titleChunk) => {return `${titleChunk} - Features`}});
useSeoMeta({
    description: `Explore our unified cloud modules: HR, automated Payroll, Inventory tracking, robust Finance analytics, and POS. Streamline your enterprise architecture.`,
    canonical: `${config.public.siteUrl}${route.path}`,

    ogTitle: `Modules & Features | ${config.public.siteName}`,
    ogDescription: `Explore our unified cloud modules: HR, automated Payroll, Inventory tracking, robust Finance analytics, and POS.`,
    ogType: 'website',
    ogUrl: `${config.public.siteUrl}${route.path}`,

    twitterTitle: `Modules & Features | ${config.public.siteName}`,
    twitterDescription: `Explore our unified cloud modules: HR, automated Payroll, Inventory tracking, robust Finance analytics, and POS.`,

    robots: 'index, follow'
})

definePageMeta({middleware: 'guest'});
useLayout().setNavigationMode('solid');
</script>

<style scoped>

</style>