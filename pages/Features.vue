<template>
    <div>
        <LandingWrapper>
            <div>
                <ul class="mx-auto pt-4 max-w-screen-lg">

                    <li class="mt-12"><h4 class="font-header text-lg font-medium">User & Employees</h4>
                        <p class="subtitle-color">Centralize all workforce identity data securely to manage profiles, official records, status, and organizational roles.</p>
                        <div class="mt-2 neutral-border-bottom"></div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Employee Management</div>
                            </div>

                            <div class="p-4">
                                <ul>
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
                                <div class="font-header text-lg">User management</div>
                            </div>

                            <div class="p-4">
                                <ul>
                                    <li>Role-based permissions</li>
                                    <li>User creation (auto-mail credentials)</li>
                                    <li>User employee promotion to admin</li>
                                    <li>Can revoke user access by setting to inactive</li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">User features</div>
                            </div>

                            <div class="p-4">
                                <ul>
                                    <li>Email verification</li>
                                    <li>Logout other device</li>
                                    <li>2 factor authentication (Google 2fa)</li>
                                    <li>Password reset</li>
                                </ul>
                            </div>
                        </div>
                    </li>

                    <li class="mt-12"><h4 class="font-header text-lg font-medium">Policies</h4>
                        <p class="subtitle-color">Maintain digital governance across your organization by accessing, enforcing, and staying compliant with automated company guidelines.</p>
                        <div class="mt-2 neutral-border-bottom"></div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Shift Management</div>
                            </div>

                            <div class="p-4">
                                <ul>
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
                                <div class="font-header text-lg">Holidays</div>
                            </div>

                            <div class="p-4">
                                <ul>
                                    <li>Special, Legal, and Double</li>
                                    <li>Recurrent, active, and effective date configurable</li>
                                    <li>Forfeit holiday pay option</li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Time and Attendance Management</div>
                            </div>

                            <div class="p-4">
                                <ul>
                                    <li>Attendance & Overtime manual import and adjustment</li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Leave Management</div>
                            </div>

                            <div class="p-4">
                                <ul>
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
                    </li>

                    <li class="mt-12"><h4 class="font-header text-lg font-medium">Request & Approval</h4>
                        <p class="subtitle-color">Streamline workflow requests with approvals and track submission status in real time to authorize official requests.</p>
                        <div class="mt-2 neutral-border-bottom"></div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Approval Settings</div>
                            </div>

                            <div class="p-4">
                                <ul>
                                    <li>Setup approver sequence on requests (attendance adjust, leave, overtime, payroll)</li>
                                    <li>Approvers on requests (attendance adjust, leave, overtime), attendance owner will get filtered out</li>
                                    <li>On requests (attendance adjust, leave, overtime), submitter will also get filtered out from approvers</li>
                                    <li>Admin can make a request for employees</li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Approval</div>
                            </div>

                            <div class="p-4">
                                <ul>
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
                    </li>

                    <li class="mt-12"><h4 class="font-header text-lg font-medium">Payroll</h4>
                        <p class="subtitle-color">Calculate salaries, taxes, and benefits automatically to process accurate disbursements and generate precise payroll.</p>
                        <div class="mt-2 neutral-border-bottom"></div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Foundations</div>
                            </div>

                            <div class="p-4">
                                <ul>
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
                                <div class="font-header text-lg">Payroll run</div>
                            </div>

                            <div class="p-4">
                                <ul>
                                    <li>Payroll generation and draft regeneration (auto mail notification upon generation complete)</li>
                                    <li>Employee final pay if stated employment profile end is within payroll period and no upcoming employment</li>
                                    <li>Draft payroll approval sequence on submission</li>
                                    <li>Auto mail pay slips upon approval complete</li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Salary statements</div>
                            </div>

                            <div class="p-4">
                                <ul>
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
                    </li>

                    <li class="mt-12"><h4 class="font-header text-lg font-medium">Employee Self-Service Portal</h4>
                        <p class="subtitle-color">Empower staff to monitor employee insights, payslips, leave balances & requests, or manage approvals.</p>
                        <div class="mt-2 neutral-border-bottom"></div>

                        <div class="mt-4 lining-shadow rounded-sm tint-background">
                            <div class="neutral-border-bottom rounded-t-sm px-4 py-2">
                                <div class="font-header text-lg">Self service and request & approvals</div>
                            </div>

                            <div class="p-4">
                                <ul>
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
                    </li>

                </ul>

                <div class="my-12 neutral-border-bottom"></div>
            </div>
        </LandingWrapper>
    </div>
</template>

<script setup lang="ts">
useSeoMeta({
    title: 'Kunsel ERP Features',
    ogTitle: 'Integrated Cloud ERP Solution',
    description: 'Manage HR and Payroll, Inventory, Finance, and POS in one integrated cloud platform.',
    ogDescription: 'All-in-one business management.',
})
</script>

<style scoped>

</style>