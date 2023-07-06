import useSWR from "swr";

const getUsers = (initialData) => {
    let res;
    if (initialData) {
        res = useSWR("/api/admin/users", { initialData });
    } else {
        res = useSWR("/api/admin/users");
    }
    return {
        users: res.data,
        isLoading: !res.error && !res.data,
        error: res.error,
    };
};

export default getUsers;
