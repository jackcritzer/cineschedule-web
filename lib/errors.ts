export function getApiErrorMessage(err: unknown): string {
    // Best-effort extraction from a consistent envelope or fetch wrapper.
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object') {
        const anyErr = err as any;
        // Common shapes:
        // { message: string }
        if (typeof anyErr.message === 'string') return anyErr.message;
        // { error: { message: string } }
        if (anyErr.error && typeof anyErr.error.message === 'string') return anyErr.error.message;
        // apiFetch wrappers sometimes stash in .data or .response
        if (anyErr.data?.message) return String(anyErr.data.message);
        if (anyErr.response?.data?.message) return String(anyErr.response.data.message);
    }
    return 'Login failed. Please try again.';
}